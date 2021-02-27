import {
  items as itemsData,
  upgrades as upgradesData,
  containers as containersData,
} from "@botnet/data";
import { isNonNullable } from "@botnet/utils";
import {
  Item,
  PurchasedContainer,
  PurchasedUpgrade,
  UpgradeType,
} from "@botnet/messages";
import { useCallback, useMemo } from "react";
import { useImmer } from "use-immer";
import { v4 as uuid } from "uuid";
import { State } from "./State";
import { Inventory } from "./Inventory";
import { range } from "lodash";
import { getTargetCoords } from "./getTargetCoords";

type FullSlot = {
  id: string;
  x: number;
  y: number;
  item: Item;
  containerId: string;
};

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
export type Sort = (options: { containerId: string }) => void;
export type Sell = () => void;
type SortMethod = "horizontal" | "vertical";

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
        level: 0,
      },
      AUTOMATE_SELL: {
        level: 0,
      },
      AUTOMATE_SORT: {
        level: 0,
      },
      SORT: {
        level: 0,
      },
      PACK: {
        level: 0,
      },
      APPRAISE: {
        level: 0,
      },
      AUTOMATE_APPRAISE: {
        level: 0,
      },
    },
    purchasedContainerMap: {
      [STARTING_CONTAINER.id]: STARTING_CONTAINER,
    },
    selling: false,
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
      const grid = initializeGrid({
        width: container.width,
        height: container.height,
      });
      const slots = container.slotIds.map((slotId) => {
        const slot = state.slotMap[slotId];
        return {
          ...slot,
          item: state.itemMap[slot.itemId],
        };
      });
      recalculateGrid({
        slots,
        grid,
      });

      const nextUpgrade =
        state.containerMap[containerId].levels[container.level];

      let full = false;
      if (state.heldItemId) {
        const item = state.itemMap[state.heldItemId];
        const slot = findSlot({
          containerInv: {
            grid,
            width: container.width,
            height: container.height,
          },
          height: item.height,
          width: item.width,
          method: sortMethod(state.purchasedUpgradeMap.SORT),
        });
        if (!slot) {
          full = true;
        }
      }

      return {
        ...container,
        slots,
        grid,
        nextUpgrade,
        full,
      };
    },
    [
      state.containerMap,
      state.heldItemId,
      state.itemMap,
      state.purchasedContainerMap,
      state.purchasedUpgradeMap.SORT,
      state.slotMap,
    ],
  );

  const inventory = useMemo(() => {
    return getInventory(state.currentContainerId);
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
      if (state.selling) {
        return;
      }
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
    [setState, state.selling],
  );

  const sort: Sort = useCallback(
    ({ containerId }) => {
      if (state.selling) {
        return;
      }
      const upgrade = state.purchasedUpgradeMap.SORT;
      const method = upgrade.level > 1 ? "vertical" : "horizontal";
      const container = state.purchasedContainerMap[containerId];
      const currentSlots = container.slotIds.map((slotId) => {
        const slot = state.slotMap[slotId];
        return {
          ...slot,
          item: state.itemMap[slot.itemId],
        };
      });
      let grid = initializeGrid({
        width: container.width,
        height: container.height,
      });
      const sorted = currentSlots.slice().sort((a, b) => {
        return a.item.width * a.item.height < b.item.width * b.item.height
          ? 1
          : -1;
      });
      const targetSlots: FullSlot[] = [];
      for (const slot of sorted) {
        const target = findSlot({
          containerInv: {
            grid,
            width: container.width,
            height: container.height,
          },
          height: slot.item.height,
          width: slot.item.width,
          method,
        });
        if (!target) {
          return;
        }
        targetSlots.push({
          ...slot,
          x: target.x,
          y: target.y,
        });

        recalculateGrid({
          slots: targetSlots,
          grid,
        });
      }
      setState((draft) => {
        targetSlots.forEach((slot) => {
          draft.slotMap[slot.id].x = slot.x;
          draft.slotMap[slot.id].y = slot.y;
        });
      });
    },
    [
      setState,
      state.itemMap,
      state.purchasedContainerMap,
      state.purchasedUpgradeMap.SORT,
      state.selling,
      state.slotMap,
    ],
  );

  const pack: Pack = useCallback(
    ({ itemId }) => {
      if (state.selling) {
        return;
      }
      const { width, height } = state.itemMap[itemId];
      for (const container of Object.values(state.purchasedContainerMap)) {
        const containerInv = getInventory(container.id);
        const target = findSlot({
          containerInv,
          height,
          width,
          method: "horizontal",
        });
        if (target) {
          const { x, y } = target;
          addSlot({ containerId: container.id, itemId, x, y });
        }
      }
    },
    [
      addSlot,
      getInventory,
      state.itemMap,
      state.purchasedContainerMap,
      state.selling,
    ],
  );

  const moveSlot: MoveSlot = useCallback(
    ({ slotId, x, y, containerId }) => {
      if (state.selling) {
        return;
      }
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
        }
        slot.x = x;
        slot.y = y;
      });
    },
    [setState, state.selling],
  );

  const sell: Sell = useCallback(() => {
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
    sort,
    selling: state.selling,
  };
};

const initializeGrid = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const grid: Inventory["grid"] = range(0, height).map(() => {
    return range(0, width).map(() => false);
  });
  return grid;
};

const findSlot = ({
  containerInv,
  width,
  height,
  method,
}: {
  containerInv: Pick<Inventory, "width" | "height" | "grid">;
  width: number;
  height: number;
  method: SortMethod;
}) => {
  if (method === "horizontal") {
    for (const y of range(0, containerInv.height)) {
      for (const x of range(0, containerInv.width)) {
        const targetCoords = getTargetCoords({
          inventory: containerInv,
          target: {
            x,
            y,
            width,
            height,
            slotId: undefined,
          },
        });
        if (targetCoords.valid) {
          return { x, y };
        }
      }
    }
  } else if (method === "vertical") {
    for (const x of range(0, containerInv.width)) {
      for (const y of range(0, containerInv.height)) {
        const targetCoords = getTargetCoords({
          inventory: containerInv,
          target: {
            x,
            y,
            width,
            height,
            slotId: undefined,
          },
        });
        if (targetCoords.valid) {
          return { x, y };
        }
      }
    }
  }
};
function recalculateGrid({
  slots,
  grid,
}: {
  slots: FullSlot[];
  grid: (string | false)[][];
}) {
  slots.forEach((slot) => {
    range(0, slot.item.height).forEach((row) => {
      range(0, slot.item.width).forEach((col) => {
        grid[slot.y + row][slot.x + col] = slot.id;
      });
    });
  });
}

const sortMethod = (upgrade: PurchasedUpgrade): SortMethod => {
  if (upgrade.level > 1) {
    return "vertical";
  }
  return "horizontal";
};
