import {
  items as itemsData,
  upgrades as upgradesData,
  containers as containersData,
} from "@botnet/data";
import { isNonNullable } from "@botnet/utils";
import { PurchasedContainer, UpgradeType } from "@botnet/messages";
import { useCallback, useMemo } from "react";
import { useImmer } from "use-immer";
import { v4 as uuid } from "uuid";
import { State } from "./State";
import { Inventory } from "./Inventory";
import { range } from "lodash";
import { findAvailable } from "./findAvailable";

const STARTING_CONTAINER: PurchasedContainer = {
  id: containersData[0].id,
  level: containersData[0].levels[0].level,
  width: containersData[0].levels[0].width,
  height: containersData[0].levels[0].height,
  slotIds: [],
};

export type SetHeldItem = (itemId: string) => void;
export type MoveSlot = (options: {
  slotId: string;
  x: number;
  y: number;
  containerId: string;
}) => void;
export type AddSlot = (options: {
  itemId: string;
  x: number;
  y: number;
  containerId: string;
}) => void;
export type BuyUpgrade = (options: { id: UpgradeType; level: number }) => void;
export type BuyContainerUpgrade = (options: { id: string }) => void;
export type Pack = (options: { itemId: string }) => void;

/**
 * Set up local state to hold onto messages received from the server.
 *
 * Concerns:
 * - Listen to incoming messages and set state.
 * - Provide functions to other hooks to modify state.
 *
 */
export const useStore = () => {
  const [state, setState] = useImmer<State>(() => ({
    messages: [],
    containerMap: Object.fromEntries(
      containersData.map((item) => [item.id, item]),
    ),
    currentContainerId: STARTING_CONTAINER.id,
    itemMap: Object.fromEntries(itemsData.map((item) => [item.id, item])),
    slotMap: {},
    heldItemId: undefined,
    moneys: 0,
    upgradeMap: Object.fromEntries(
      upgradesData.map((upgrade) => [upgrade.id, upgrade]),
    ),
    purchasedUpgradeMap: {
      AUTOMATE_PACK: {
        id: "AUTOMATE_PACK",
        level: 0,
      },
      AUTOMATE_SELL: {
        id: "AUTOMATE_PACK",
        level: 0,
      },
      AUTOMATE_SORT: {
        id: "AUTOMATE_PACK",
        level: 0,
      },
      SORT: {
        id: "AUTOMATE_PACK",
        level: 0,
      },
    },
    purchasedContainerMap: {
      [STARTING_CONTAINER.id]: STARTING_CONTAINER,
    },
  }));

  const clearHistory = useCallback(() => {
    setState((draft) => {
      draft.messages = [];
    });
  }, [setState]);

  const setHeldItem: SetHeldItem = useCallback(
    (itemId) => {
      setState((draft) => {
        draft.heldItemId = itemId;
      });
    },
    [setState],
  );

  const getInventory = useCallback(
    (containerId: string): Inventory => {
      const container = state.purchasedContainerMap[containerId];
      const grid: Inventory["grid"] = range(0, container.height).map(() => {
        return range(0, container.width).map(() => false);
      });
      container.slotIds.forEach((slotId) => {
        const slot = state.slotMap[slotId];
        const item = state.itemMap[slot.itemId];
        range(0, item.height).forEach((row) => {
          range(0, item.width).forEach((col) => {
            grid[slot.y + row][slot.x + col] = slotId;
          });
        });
      });
      const nextUpgrade =
        state.containerMap[containerId].levels[container.level];

      return {
        ...container,
        slots: container.slotIds.map((slotId) => {
          const slot = state.slotMap[slotId];
          return {
            ...slot,
            item: state.itemMap[slot.itemId],
          };
        }),
        grid,
        nextUpgrade,
      };
    },
    [
      state.containerMap,
      state.itemMap,
      state.purchasedContainerMap,
      state.slotMap,
    ],
  );

  const inventory = useMemo(() => {
    return state.currentContainerId
      ? getInventory(state.currentContainerId)
      : undefined;
  }, [getInventory, state.currentContainerId]);

  const allItems = useMemo(() => {
    return Object.values(state.purchasedContainerMap).flatMap((container) => {
      return container.slotIds.map((slotId) => {
        return state.itemMap[state.slotMap[slotId].itemId];
      });
    });
  }, [state.itemMap, state.purchasedContainerMap, state.slotMap]);

  const addSlot: AddSlot = useCallback(
    ({ itemId, x, y, containerId }) => {
      const slot = {
        id: uuid(),
        x,
        y,
        itemId,
        containerId,
      };

      // need to check overlaps here
      setState((draft) => {
        draft.slotMap[slot.id] = slot;
        draft.purchasedContainerMap[containerId].slotIds.push(slot.id);
        draft.heldItemId = undefined;
      });
    },
    [setState],
  );

  const pack: Pack = useCallback(
    ({ itemId }) => {
      const { width, height } = state.itemMap[itemId];
      for (const container of Object.values(state.purchasedContainerMap)) {
        const containerInv = getInventory(container.id);
        for (const row of range(0, containerInv.height)) {
          for (const col of range(0, containerInv.width)) {
            const available = !containerInv.grid[row][col];
            if (available) {
              const { availableRight, availableDown } = findAvailable({
                grid: containerInv.grid,
                height: containerInv.height,
                width: containerInv.width,
                startX: col,
                startY: row,
              });
              if (availableRight + 1 >= width && availableDown + 1 >= height) {
                addSlot({ containerId: container.id, x: col, y: row, itemId });
                return;
              }
            }
          }
        }
      }
    },
    [addSlot, getInventory, state.itemMap, state.purchasedContainerMap],
  );

  const moveSlot: MoveSlot = useCallback(
    ({ slotId, x, y, containerId }) => {
      setState((draft) => {
        const slot = draft.slotMap[slotId];
        const currentContainerId = slot.containerId;
        if (currentContainerId !== containerId) {
          draft.purchasedContainerMap[
            currentContainerId
          ].slotIds = draft.purchasedContainerMap[containerId].slotIds.filter(
            (currentSlotId) => currentSlotId === slotId,
          );
          draft.purchasedContainerMap[containerId].slotIds.push(slot.id);
          slot.x = x;
          slot.y = y;
        }
      });
    },
    [setState],
  );

  const sell = useCallback(() => {
    const multiplier = Math.max(1, Math.sqrt(allItems.length));
    setState((draft) => {
      draft.moneys =
        draft.moneys +
        allItems.reduce((sum, item) => sum + item.value * multiplier, 0);
      Object.values(draft.purchasedContainerMap).forEach((container) => {
        container.slotIds = [];
      });
      draft.slotMap = {};
    });
  }, [allItems, setState]);

  const buyUpgrade: BuyUpgrade = useCallback(
    ({ id, level: levelNumber }) => {
      setState((draft) => {
        const upgradeToBuy = draft.upgradeMap[id];
        const level = upgradeToBuy.levels.find(
          (item) => item.level === levelNumber,
        )!;
        if (draft.moneys >= level.cost) {
          draft.moneys = draft.moneys - level.cost;
          draft.purchasedUpgradeMap[id].level = level.level;
        }
      });
    },
    [setState],
  );

  const buyContainerUpgrade: BuyContainerUpgrade = useCallback(
    ({ id }) => {
      setState((draft) => {
        const current = draft.purchasedContainerMap[id];
        const next = draft.containerMap[id].levels.find(
          (level) => level.level === current.level + 1,
        );
        if (next && draft.moneys >= next.cost) {
          draft.moneys = draft.moneys - next.cost;
          draft.purchasedContainerMap[id].level = next.level;
          draft.purchasedContainerMap[id].width = next.width;
          draft.purchasedContainerMap[id].height = next.height;
        }
      });
    },
    [setState],
  );

  const availableUpgrades = useMemo(() => {
    return Object.values(state.upgradeMap)
      .map((available) => {
        const currentLevel = state.purchasedUpgradeMap[available.id].level;
        const nextLevel = available.levels.find(
          (level) => level.level === currentLevel + 1,
        );
        if (!nextLevel) {
          return undefined;
        }
        return {
          name: available.name,
          id: available.id,
          level: nextLevel.level,
          cost: nextLevel.cost,
          canAfford: state.moneys >= nextLevel.cost,
        };
      })
      .filter(isNonNullable);
  }, [state.moneys, state.purchasedUpgradeMap, state.upgradeMap]);

  const heldItem = useMemo(() => {
    if (!state.heldItemId) {
      return undefined;
    }
    return state.itemMap[state.heldItemId];
  }, [state.heldItemId, state.itemMap]);

  const availableItems = useMemo(() => {
    return Object.values(state.itemMap);
  }, [state.itemMap]);

  return {
    addSlot,
    availableItems,
    availableUpgrades,
    buyContainerUpgrade,
    buyUpgrade,
    clearHistory,
    getInventory,
    heldItem,
    inventory,
    moneys: state.moneys,
    moveSlot,
    pack,
    purchasedUpgradeMap: state.purchasedUpgradeMap,
    sell,
    setHeldItem,
    setState,
  };
};
