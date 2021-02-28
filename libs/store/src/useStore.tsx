import {
  items as itemsData,
  upgrades as upgradesData,
  containers as containersData,
} from "@botnet/data";
import { isNonNullable } from "@botnet/utils";
import {
  Item,
  PlayerLocation,
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

export type Loot = (options: { itemId: string }) => void;
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
export type Pack = () => void;
export type StoreHeldItem = () => void;
export type Sort = (options: { containerId: string }) => void;
export type Sell = () => void;
export type Travel = (options: { destination: PlayerLocation }) => void;
export type Adventure = () => void;
export type SellItem = () => void;
export type Arrive = () => void;
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
    moneys: 1000,
    upgradeMap: Object.fromEntries(
      upgradesData.map((upgrade) => [upgrade.id, upgrade]),
    ),
    purchasedUpgradeMap: {
      AUTOMATE_PACK: {
        level: 0,
        enabled: true,
      },
      AUTOMATE_SELL: {
        level: 0,
        enabled: true,
      },
      AUTOMATE_TRAVEL: {
        level: 0,
        enabled: true,
      },
      AUTOMATE_SORT: {
        level: 0,
        enabled: true,
      },
      SORT: {
        level: 0,
        enabled: true,
      },
      PACK: {
        level: 0,
        enabled: true,
      },
      APPRAISE: {
        level: 0,
        enabled: true,
      },
      AUTOMATE_KILL: {
        level: 0,
        enabled: true,
      },
      AUTOMATE_APPRAISE: {
        level: 0,
        enabled: true,
      },
    },
    purchasedContainerMap: {
      [STARTING_CONTAINER.id]: STARTING_CONTAINER,
    },
    playerAction: "IDLE",
    playerLocation: "TOWN",
    playerDestination: undefined,
  }));

  const clearHistory = useCallback(() => {
    setState((draft) => {
      draft.messages = [];
    });
  }, [setState]);

  const loot: Loot = useCallback(
    ({ itemId }) => {
      setState((draft) => {
        draft.heldItemId = itemId;
        draft.playerAction = "IDLE";
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

  // const allItems = useMemo(() => {
  //   return Object.values(state.purchasedContainerMap).flatMap((container) => {
  //     return container.slotIds.map((slotId) => {
  //       return state.itemMap[state.slotMap[slotId].itemId];
  //     });
  //   });
  // }, [state.itemMap, state.purchasedContainerMap, state.slotMap]);

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

  const sort: Sort = useCallback(
    ({ containerId }) => {
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
      state.slotMap,
    ],
  );

  const storeHeldItem: StoreHeldItem = useCallback(() => {
    if (!state.heldItemId) {
      return;
    }
    const heldItem = state.itemMap[state.heldItemId];
    const { width, height } = heldItem;
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
        addSlot({ containerId: container.id, itemId: state.heldItemId, x, y });
      }
    }
  }, [
    addSlot,
    getInventory,
    state.heldItemId,
    state.itemMap,
    state.purchasedContainerMap,
  ]);
  const pack: Pack = useCallback(() => {
    setState((draft) => {
      draft.playerAction = "STORING";
    });
  }, [setState]);

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
        }
        slot.x = x;
        slot.y = y;
      });
    },
    [setState],
  );

  const sell: Sell = useCallback(() => {
    setState((draft) => {
      draft.playerLocation = "TOWN";
      draft.playerAction = "SELLING";
    });
  }, [setState]);

  const travel: Travel = useCallback(
    ({ destination }) => {
      setState((draft) => {
        draft.playerAction = "TRAVELLING";
        draft.playerDestination = destination;
      });
    },
    [setState],
  );

  const arrive: Arrive = useCallback(() => {
    setState((draft) => {
      if (draft.playerDestination) {
        draft.playerLocation = draft.playerDestination;
        draft.playerAction = "IDLE";
      } else {
        throw new Error("somehow ended up arriving without a destination");
      }
    });
  }, [setState]);

  const adventure: Adventure = useCallback(() => {
    setState((draft) => {
      draft.playerAction = "KILLING";
    });
  }, [setState]);

  const sellItem: SellItem = useCallback(() => {
    setState((draft) => {
      const container = Object.values(draft.purchasedContainerMap).filter(
        (cont) => cont.slotIds.length,
      )[0];
      if (!container) {
        draft.playerAction = "IDLE";
        return;
      }
      const slotId = container.slotIds[0];
      draft.moneys += draft.itemMap[draft.slotMap[slotId].itemId].value;
      container.slotIds = container.slotIds.filter((id) => id !== slotId);
      draft.slotMap[slotId] = undefined!; // it's fine as long as I removed all references
    });
  }, [setState]);

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
    playerAction: state.playerAction,
    playerDestination: state.playerDestination,
    playerLocation: state.playerLocation,
    purchasedUpgradeMap: state.purchasedUpgradeMap,
    storeHeldItem,
    sell,
    loot,
    setState,
    sort,
    travel,
    arrive,
    adventure,
    sellItem,
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
