import { items as itemsData, upgrades as upgradesData } from "@botnet/data";
import { isNonNullable } from "@botnet/utils";
import { Container, UpgradeType } from "@botnet/messages";
import { useCallback, useMemo } from "react";
import { useImmer } from "use-immer";
import { v4 as uuid } from "uuid";
import { State } from "./State";

const STARTING_CONTAINER: Container = {
  id: uuid(),
  height: 3,
  width: 3,
  slotIds: [],
  cost: 0,
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
    containerIds: [STARTING_CONTAINER.id],
    containerMap: { [STARTING_CONTAINER.id]: STARTING_CONTAINER },
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
  }));

  const clearHistory = useCallback(() => {
    setState((draft) => {
      draft.messages = [];
    });
  }, [setState]);

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
        draft.containerMap[containerId].slotIds.push(slot.id);
        draft.heldItemId = undefined;
      });
    },
    [setState],
  );

  const setHeldItem: SetHeldItem = useCallback(
    (itemId) => {
      setState((draft) => {
        draft.heldItemId = itemId;
      });
    },
    [setState],
  );

  const moveSlot: MoveSlot = useCallback(
    ({ slotId, x, y, containerId }) => {
      // need to check overlaps here
      setState((draft) => {
        const slot = draft.slotMap[slotId];
        const currentContainerId = slot.containerId;
        if (currentContainerId !== containerId) {
          draft.containerMap[currentContainerId].slotIds = draft.containerMap[
            containerId
          ].slotIds.filter((currentSlotId) => currentSlotId === slotId);
          draft.containerMap[containerId].slotIds.push(slot.id);
          slot.x = x;
          slot.y = y;
        }
      });
    },
    [setState],
  );

  const inventory = useMemo(() => {
    if (!state.currentContainerId) {
      return undefined;
    }
    const container = state.containerMap[state.currentContainerId];
    return {
      ...container,
      slots: container.slotIds.map((slotId) => {
        const slot = state.slotMap[slotId];
        return {
          ...slot,
          item: state.itemMap[slot.itemId],
        };
      }),
    };
  }, [
    state.containerMap,
    state.currentContainerId,
    state.itemMap,
    state.slotMap,
  ]);

  const allItems = useMemo(() => {
    return state.containerIds.flatMap((id) => {
      return state.containerMap[id].slotIds.map((slotId) => {
        return state.itemMap[state.slotMap[slotId].itemId];
      });
    });
  }, [state.containerIds, state.containerMap, state.itemMap, state.slotMap]);

  const sell = useCallback(() => {
    const multiplier = Math.max(1, Math.sqrt(allItems.length));
    setState((draft) => {
      draft.moneys =
        draft.moneys +
        allItems.reduce((sum, item) => sum + item.value * multiplier, 0);
      draft.containerIds.forEach((id) => {
        draft.containerMap[id].slotIds = [];
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
    buyUpgrade,
    setHeldItem,
    moveSlot,
    clearHistory,
    inventory,
    heldItem,
    setState,
    availableItems,
    sell,
    moneys: state.moneys,
    availableUpgrades,
    purchasedUpgradeMap: state.purchasedUpgradeMap,
  };
};
