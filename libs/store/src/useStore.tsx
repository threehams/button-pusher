import {
  items as itemsData,
  upgrades as upgradesData,
  containers as containersData,
} from "@botnet/data";
import {
  Item,
  PlayerLocation,
  PurchasedContainer,
  UpgradeType,
} from "@botnet/messages";
import { useCallback, useEffect, useMemo } from "react";
import { useImmer } from "use-immer";
import { v4 as uuid } from "uuid";
import { State } from "./State";
import { Inventory } from "./Inventory";
import { range } from "lodash";
import { getTargetCoords } from "./getTargetCoords";
import { PurchasedUpgradeMap } from "./PurchasedUpgradeMap";
import { StoreContextType } from "./StoreContext";

type FullSlot = {
  id: string;
  x: number;
  y: number;
  item: Item;
  containerId: string;
};

const STARTING_CONTAINER: PurchasedContainer = {
  id: containersData[0].id,
  level: 0,
  width: containersData[0].baseWidth,
  height: containersData[0].baseHeight,
  maxWidth: containersData[0].maxWidth,
  maxHeight: containersData[0].maxHeight,
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
export type BuyUpgrade = (options: { id: UpgradeType }) => void;
export type BuyContainerUpgrade = (options: { id: string }) => void;
export type Pack = () => void;
export type StoreHeldItem = () => void;
export type Sort = (options: { containerId: string }) => void;
export type Sell = () => void;
export type Travel = (options: { destination: PlayerLocation }) => void;
export type Adventure = () => void;
export type SellItem = () => void;
export type Arrive = () => void;
export type BuyContainer = () => void;
export type NextInventory = string | undefined;
export type PrevInventory = string | undefined;
export type GoInventory = (options: { containerId: string }) => void;

type SortMethod = "horizontal" | "vertical";

/**
 * Set up local state to hold onto messages received from the server.
 *
 * Concerns:
 * - Listen to incoming messages and set state.
 * - Provide functions to other hooks to modify state.
 *
 */
export const useStore = (): StoreContextType => {
  const [state, setState] = useImmer<State>(() => ({
    containerMap: Object.fromEntries(
      containersData.map((item) => [item.id, item]),
    ),
    currentContainerId: STARTING_CONTAINER.id,
    itemMap: Object.fromEntries(
      itemsData.map((item) => {
        return [
          item.id,
          {
            ...item,
            cost: item.height * item.width * 10,
          },
        ];
      }),
    ),
    slotMap: {},
    heldItemId: undefined,
    moneys: 0,
    upgradeMap: upgradesData,
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
      KILL: {
        level: 0,
        enabled: true,
      },
      SELL: {
        level: 0,
        enabled: true,
      },
      TRAVEL: {
        level: 0,
        enabled: true,
      },
    },
    purchasedContainerIds: [STARTING_CONTAINER.id],
    purchasedContainerMap: {
      [STARTING_CONTAINER.id]: STARTING_CONTAINER,
    },
    playerAction: "IDLE",
    playerLocation: "TOWN",
    playerDestination: undefined,
    highestMoneys: 0,
    sellableItems: 0,
  }));

  const purchasedUpgrades: PurchasedUpgradeMap = useMemo(() => {
    return Object.entries(state.purchasedUpgradeMap).reduce(
      (result, [id, purchasedUpgrade]) => {
        const upgradeType = id as UpgradeType;
        const upgrade = state.upgradeMap[id];
        result[upgradeType] = {
          ...purchasedUpgrade,
          id: upgradeType,
          name: upgrade.name,
          upgradeName: upgrade.upgradeName,
          time: 2000 * (1 / (purchasedUpgrade.level + 1)),
          cost: upgrade.baseCost * (purchasedUpgrade.level + 1) ** 2,
        };
        return result;
      },
      {} as PurchasedUpgradeMap,
    );
  }, [state.purchasedUpgradeMap, state.upgradeMap]);

  const loot: Loot = useCallback(
    ({ itemId }) => {
      setState((draft) => {
        draft.heldItemId = itemId;
        draft.playerAction = "IDLE";
      });
    },
    [setState],
  );

  const currentCapacity = useMemo(() => {
    return state.purchasedContainerIds.reduce((sum, id) => {
      const { width, height } = state.purchasedContainerMap[id];
      return sum + width * height;
    }, 0);
  }, [state.purchasedContainerIds, state.purchasedContainerMap]);

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

      const { cost } = getNextLevel(container, currentCapacity);
      const cont = containersData[0];
      const nextContainer = getNextLevel(
        {
          height: cont.baseHeight,
          width: cont.baseWidth,
          maxHeight: cont.maxHeight,
          maxWidth: cont.maxWidth,
        },
        currentCapacity,
      );
      const isLast =
        state.purchasedContainerIds.indexOf(containerId) ===
        state.purchasedContainerIds.length - 1;

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
          method: "vertical",
        });
        if (!slot) {
          full = true;
        }
      }

      return {
        ...container,
        slots,
        grid,
        cost,
        nextAvailable: cost !== 0 || !isLast ? 0 : nextContainer.cost,
        full,
      };
    },
    [
      currentCapacity,
      state.heldItemId,
      state.itemMap,
      state.purchasedContainerIds,
      state.purchasedContainerMap,
      state.slotMap,
    ],
  );

  const inventory = useMemo(() => {
    return getInventory(state.currentContainerId);
  }, [getInventory, state.currentContainerId]);

  const allInventory = useMemo(() => {
    let slots = 0;
    let full = true;
    for (const containerId of state.purchasedContainerIds) {
      const inv = getInventory(containerId);
      if (!inv.full) {
        full = false;
      }
      slots += inv.slots.length;
    }
    return {
      slots,
      full,
    };
  }, [getInventory, state.purchasedContainerIds]);

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
          method: "vertical",
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
    [setState, state.itemMap, state.purchasedContainerMap, state.slotMap],
  );

  const storeHeldItem: StoreHeldItem = useCallback(() => {
    setState((draft) => {
      draft.playerAction = "IDLE";
    });
    if (!state.heldItemId) {
      return;
    }
    const heldItem = state.itemMap[state.heldItemId];
    const { width, height } = heldItem;
    for (const containerId of state.purchasedContainerIds) {
      const container = state.purchasedContainerMap[containerId];
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
        return;
      }
    }
  }, [
    addSlot,
    getInventory,
    setState,
    state.heldItemId,
    state.itemMap,
    state.purchasedContainerIds,
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
        draft.sellableItems = 0;
      });
    },
    [setState],
  );

  const arrive: Arrive = useCallback(() => {
    setState((draft) => {
      if (draft.playerDestination) {
        draft.playerLocation = draft.playerDestination;
        draft.playerDestination = undefined;
        draft.playerAction = "IDLE";
        draft.sellableItems = inventory.slots.length;
      } else {
        throw new Error("somehow ended up arriving without a destination");
      }
    });
  }, [inventory.slots.length, setState]);

  const adventure: Adventure = useCallback(() => {
    setState((draft) => {
      draft.playerAction = "KILLING";
    });
  }, [setState]);

  const sellItem: SellItem = useCallback(() => {
    setState((draft) => {
      draft.playerAction = "IDLE";
      const container = Object.values(draft.purchasedContainerMap).filter(
        (cont) => cont.slotIds.length,
      )[0];
      if (!container) {
        return;
      }
      const slotId = container.slotIds[0];
      draft.moneys += Math.floor(
        draft.itemMap[draft.slotMap[slotId].itemId].value *
          getSellMultiplier(draft.sellableItems),
      );
      container.slotIds = container.slotIds.filter((id) => id !== slotId);
      draft.slotMap[slotId] = undefined!; // it's fine as long as I removed all references
    });
  }, [setState]);

  const buyUpgrade: BuyUpgrade = useCallback(
    ({ id }) => {
      setState((draft) => {
        const upgrade = purchasedUpgrades[id];
        if (draft.moneys >= upgrade.cost) {
          draft.moneys = draft.moneys - upgrade.cost;
          draft.purchasedUpgradeMap[id].level += 1;
        }
      });
    },
    [purchasedUpgrades, setState],
  );

  const buyContainer: BuyContainer = useCallback(() => {
    setState((draft) => {
      const cont = containersData[0];
      const next = getNextLevel(
        {
          height: cont.baseHeight,
          width: cont.baseWidth,
          maxHeight: cont.maxHeight,
          maxWidth: cont.maxWidth,
        },
        currentCapacity,
      );
      if (next.cost <= state.moneys) {
        const id = uuid();
        draft.containerMap[id] = {
          ...cont,
        };
        draft.purchasedContainerIds.push(id);
        draft.purchasedContainerMap[id] = {
          id,
          height: cont.baseHeight,
          width: cont.baseWidth,
          level: 0,
          maxHeight: cont.maxHeight,
          maxWidth: cont.maxWidth,
          slotIds: [],
        };
      }
    });
  }, [currentCapacity, setState, state.moneys]);

  const nextInventory = () => {
    const current = state.purchasedContainerIds.indexOf(
      state.currentContainerId,
    );
    return state.purchasedContainerIds[current + 1];
  };
  const prevInventory = () => {
    const current = state.purchasedContainerIds.indexOf(
      state.currentContainerId,
    );
    return state.purchasedContainerIds[current - 1];
  };
  const goInventory: GoInventory = ({ containerId }) => {
    setState((draft) => {
      draft.currentContainerId = containerId;
    });
  };

  const buyContainerUpgrade: BuyContainerUpgrade = useCallback(
    ({ id }) => {
      setState((draft) => {
        const current = draft.purchasedContainerMap[id];
        const next = getNextLevel(current, currentCapacity);
        if (next.cost && draft.moneys >= next.cost) {
          draft.moneys = draft.moneys - next.cost;
          draft.purchasedContainerMap[id].level += 1;
          draft.purchasedContainerMap[id].width = next.width;
          draft.purchasedContainerMap[id].height = next.height;
        }
      });
    },
    [currentCapacity, setState],
  );

  const heldItem = useMemo(() => {
    if (!state.heldItemId) {
      return undefined;
    }
    return state.itemMap[state.heldItemId];
  }, [state.heldItemId, state.itemMap]);

  const availableItems = useMemo(() => {
    return Object.values(state.itemMap);
  }, [state.itemMap]);

  useEffect(() => {
    setState((draft) => {
      draft.highestMoneys = Math.max(draft.highestMoneys, draft.moneys);
    });
  }, [setState, state.moneys]);

  return {
    addSlot,
    availableItems,
    buyContainerUpgrade,
    buyUpgrade,
    heldItem,
    inventory,
    moneys: state.moneys,
    moveSlot,
    pack,
    playerAction: state.playerAction,
    playerDestination: state.playerDestination,
    playerLocation: state.playerLocation,
    storeHeldItem,
    sell,
    loot,
    sort,
    travel,
    arrive,
    adventure,
    sellItem,
    purchasedUpgrades,
    highestMoneys: state.highestMoneys,
    buyContainer,
    nextInventory: nextInventory(),
    prevInventory: prevInventory(),
    goInventory,
    allInventory,
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

const TILE_COST = 25;

const getNextLevel = (
  container: {
    width: number;
    height: number;
    maxHeight: number;
    maxWidth: number;
  },
  currentCapacity: number,
) => {
  const { width, height, maxWidth, maxHeight } = container;
  let diff;
  let newWidth;
  let newHeight;
  if (width >= maxWidth && height >= maxHeight) {
    return {
      cost: 0,
      width,
      height,
    };
  } else if (width >= maxWidth) {
    diff = width;
    newWidth = width;
    newHeight = height + 1;
  } else if (width >= maxWidth) {
    diff = height;
    newWidth = width + 1;
    newHeight = height;
  } else if (width <= height) {
    diff = height;
    newWidth = width + 1;
    newHeight = height;
  } else {
    diff = width;
    newWidth = width;
    newHeight = height + 1;
  }

  return {
    width: newWidth,
    height: newHeight,
    // scale this better
    cost: Math.floor(
      TILE_COST * (currentCapacity * Math.log(currentCapacity - 13) + diff),
    ),
  };
};

const getSellMultiplier = (count: number) => {
  return Math.sqrt(count) + count / 10;
};
