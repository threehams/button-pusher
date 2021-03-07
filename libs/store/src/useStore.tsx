import {
  items as availableItems,
  upgrades as availableUpgrades,
  availableContainers as availableContainers,
  modifiers as availableModifiers,
} from "@botnet/data";
import { isNonNullable } from "@botnet/utils";
import {
  Item,
  ItemDefinition,
  ModifierType,
  PlayerLocation,
  PurchasedContainer,
  Rarity,
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
import { choice } from "./choice";

type FullSlot = {
  id: string;
  x: number;
  y: number;
  item: Item;
  containerId: string;
};

export type Loot = () => void;
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
export type AutomatedUpgrade =
  | "AUTOMATE_KILL"
  | "AUTOMATE_PACK"
  | "AUTOMATE_SELL"
  | "AUTOMATE_SORT"
  | "AUTOMATE_TRAVEL"
  | "AUTOMATE_DROP_JUNK";
export type Disable = (action: AutomatedUpgrade) => void;
export type Enable = (action: AutomatedUpgrade) => void;
export type CheatType = "AUTOMATION" | "MIDGAME";
export type Cheat = (type: CheatType) => void;
export type Reset = () => void;
export type Trash = () => void;
export type DropJunk = () => void;
export type DropJunkItem = () => void;

type SortMethod = "horizontal" | "vertical";

const SAVE_KEY = "youAreOverburdenedSave";

const STARTING_CONTAINER: PurchasedContainer = {
  id: uuid(),
  level: 0,
  width: availableContainers[1].baseWidth,
  height: availableContainers[1].baseHeight,
  maxWidth: availableContainers[1].maxWidth,
  maxHeight: availableContainers[1].maxHeight,
  type: availableContainers[1].type,
  slotIds: [],
  sorted: false,
};
const HAND_CONTAINER: PurchasedContainer = {
  id: uuid(),
  level: 0,
  width: availableContainers[0].baseWidth,
  height: availableContainers[0].baseHeight,
  maxWidth: availableContainers[0].maxWidth,
  maxHeight: availableContainers[0].maxHeight,
  type: availableContainers[0].type,
  slotIds: [],
  sorted: false,
};
const TOWN_FLOOR_CONTAINER: PurchasedContainer = {
  id: uuid(),
  level: 0,
  width: availableContainers[2].baseWidth,
  height: availableContainers[2].baseHeight,
  maxWidth: availableContainers[2].maxWidth,
  maxHeight: availableContainers[2].maxHeight,
  type: availableContainers[2].type,
  slotIds: [],
  sorted: false,
};
const KILLING_FIELDS_FLOOR_CONTAINER: PurchasedContainer = {
  id: uuid(),
  level: 0,
  width: availableContainers[2].baseWidth,
  height: availableContainers[2].baseHeight,
  maxWidth: availableContainers[2].maxWidth,
  maxHeight: availableContainers[2].maxHeight,
  type: availableContainers[2].type,
  slotIds: [],
  sorted: false,
};

const INITIAL_STATE: State = {
  handContainerId: HAND_CONTAINER.id,
  floorIds: {
    TOWN: TOWN_FLOOR_CONTAINER.id,
    KILLING_FIELDS: KILLING_FIELDS_FLOOR_CONTAINER.id,
  },
  currentContainerId: STARTING_CONTAINER.id,
  itemMap: {},
  slotMap: {},
  moneys: 0,
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
    DROP_JUNK: {
      level: 0,
      enabled: true,
    },
    AUTOMATE_DROP_JUNK: {
      level: 0,
      enabled: true,
    },
  },
  purchasedContainerIds: [
    STARTING_CONTAINER.id,
    HAND_CONTAINER.id,
    TOWN_FLOOR_CONTAINER.id,
    KILLING_FIELDS_FLOOR_CONTAINER.id,
  ],
  purchasedContainerMap: {
    [STARTING_CONTAINER.id]: STARTING_CONTAINER,
    [HAND_CONTAINER.id]: HAND_CONTAINER,
    [TOWN_FLOOR_CONTAINER.id]: TOWN_FLOOR_CONTAINER,
    [KILLING_FIELDS_FLOOR_CONTAINER.id]: KILLING_FIELDS_FLOOR_CONTAINER,
  },
  playerAction: "IDLE" as const,
  playerLocation: "TOWN" as const,
  playerDestination: undefined,
  highestMoneys: 0,
  sellableItems: 0,
};

/**
 * Set up local state to hold onto messages received from the server.
 *
 * Concerns:
 * - Listen to incoming messages and set state.
 * - Provide functions to other hooks to modify state.
 *
 */
export const useStore = (): StoreContextType => {
  const [state, setState] = useImmer<State>(() => {
    if (typeof localStorage !== "undefined") {
      try {
        const saved = JSON.parse(localStorage.getItem(SAVE_KEY)!);
        if (saved) {
          return saved;
        }
      } catch (err) {
        // use default state
      }
    }
    return INITIAL_STATE;
  });

  const heldSlot = useMemo(() => {
    const handContainer = state.purchasedContainerMap[state.handContainerId];
    const slotId = handContainer.slotIds[0];
    if (!slotId) {
      return undefined;
    }
    const slot = state.slotMap[slotId];
    return {
      ...slot,
      item: state.itemMap[slot.itemId],
    };
  }, [
    state.handContainerId,
    state.itemMap,
    state.purchasedContainerMap,
    state.slotMap,
  ]);

  const purchasedUpgrades: PurchasedUpgradeMap = useMemo(() => {
    return Object.entries(state.purchasedUpgradeMap).reduce(
      (result, [id, purchasedUpgrade]) => {
        const upgradeType = id as UpgradeType;
        const upgrade = availableUpgrades[upgradeType];
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
  }, [state.purchasedUpgradeMap]);

  const bags = state.purchasedContainerIds.filter((id) => {
    return state.purchasedContainerMap[id].type === "BAG";
  });

  const currentCapacity = useMemo(() => {
    return bags.reduce((sum, id) => {
      const { width, height } = state.purchasedContainerMap[id];
      return sum + width * height;
    }, 0);
  }, [bags, state.purchasedContainerMap]);

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
      if (container.maxHeight > 1 && container.maxWidth > 1) {
        recalculateGrid({
          slots,
          grid,
        });
      }

      const { cost } = getNextLevel(container, currentCapacity);
      const cont = availableContainers[1];
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
      if (heldSlot) {
        const slot = findSlot({
          containerInv: {
            grid,
            width: container.width,
            height: container.height,
          },
          height: heldSlot.item.height,
          width: heldSlot.item.width,
          method: "vertical",
        });
        if (!slot) {
          full = true;
        }
      }
      let junk = false;
      for (const slot of slots) {
        if (slot.item.rarity === "JUNK") {
          junk = true;
          break;
        }
      }

      return {
        ...container,
        slots,
        grid,
        cost,
        nextAvailable: cost !== 0 || !isLast ? 0 : nextContainer.cost,
        full,
        junk,
      };
    },
    [
      currentCapacity,
      heldSlot,
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
    let junk = false;
    for (const containerId of state.purchasedContainerIds) {
      const inv = getInventory(containerId);
      if (inv.type === "FLOOR" || inv.type === "EQUIP") {
        continue;
      }
      if (!inv.full) {
        full = false;
      }
      slots += inv.slots.length;
      for (const slot of inv.slots) {
        if (slot.item.rarity === "JUNK") {
          junk = true;
          break;
        }
      }
    }
    return {
      slots,
      full,
      junk,
    };
  }, [getInventory, state.purchasedContainerIds]);

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
        draft.purchasedContainerMap[containerId].sorted = false;
      });
    },
    [setState],
  );

  const loot: Loot = useCallback(() => {
    setState((draft) => {
      const item = randomLoot(availableItems);
      draft.itemMap[item.id] = item;
      addSlot({
        containerId: draft.handContainerId,
        x: 0,
        y: 0,
        itemId: item.id,
      });
      draft.playerAction = "IDLE";
    });
  }, [addSlot, setState]);

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
          draft.purchasedContainerMap[containerId].sorted = true;
        });
      });
    },
    [setState, state.itemMap, state.purchasedContainerMap, state.slotMap],
  );

  const moveSlot: MoveSlot = useCallback(
    ({ slotId, x, y, containerId }) => {
      setState((draft) => {
        const slot = draft.slotMap[slotId];
        const currentContainerId = slot.containerId;
        if (currentContainerId !== containerId) {
          draft.purchasedContainerMap[
            currentContainerId
          ].slotIds = draft.purchasedContainerMap[
            currentContainerId
          ].slotIds.filter((currentSlotId) => currentSlotId !== slotId);
          draft.purchasedContainerMap[containerId].slotIds.push(slot.id);
          draft.purchasedContainerMap[containerId].sorted = false;
        }
        slot.x = x;
        slot.y = y;
        slot.containerId = containerId;
      });
    },
    [setState],
  );

  const storeHeldItem: StoreHeldItem = useCallback(() => {
    setState((draft) => {
      draft.playerAction = "IDLE";
    });
    if (!heldSlot) {
      return;
    }
    const { width, height } = heldSlot.item;
    for (const containerId of bags) {
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
        moveSlot({
          containerId: container.id,
          slotId: heldSlot.id,
          x,
          y,
        });
        return;
      }
    }
  }, [
    bags,
    getInventory,
    heldSlot,
    moveSlot,
    setState,
    state.purchasedContainerMap,
  ]);

  const pack: Pack = useCallback(() => {
    setState((draft) => {
      draft.playerAction = "STORING";
    });
  }, [setState]);

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
        (cont) =>
          cont.slotIds.length && (cont.type === "BAG" || cont.type === "EQUIP"),
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
      const cont = availableContainers[1];
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
        draft.purchasedContainerIds.push(id);
        draft.purchasedContainerMap[id] = {
          id,
          height: cont.baseHeight,
          width: cont.baseWidth,
          type: cont.type,
          level: 0,
          maxHeight: cont.maxHeight,
          maxWidth: cont.maxWidth,
          slotIds: [],
          sorted: false,
        };
      }
    });
  }, [currentCapacity, setState, state.moneys]);

  const nextInventory = () => {
    const current = bags.indexOf(state.currentContainerId);
    return bags[current + 1];
  };
  const prevInventory = () => {
    const current = bags.indexOf(state.currentContainerId);
    return bags[current - 1];
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

  const disable: Disable = useCallback(
    (action) => {
      setState((draft) => {
        draft.purchasedUpgradeMap[action].enabled = false;
      });
    },
    [setState],
  );

  const enable: Enable = useCallback(
    (action) => {
      setState((draft) => {
        draft.purchasedUpgradeMap[action].enabled = true;
      });
    },
    [setState],
  );

  const reset: Reset = useCallback(() => {
    setState(() => {
      return INITIAL_STATE;
    });
  }, [setState]);

  const cheat: Cheat = useCallback(
    (type) => {
      if (type === "AUTOMATION") {
        setState((draft) => {
          Object.values(draft.purchasedUpgradeMap).forEach((upgrade) => {
            upgrade.level += 1;
          });
        });
        return;
      }
    },
    [setState],
  );

  const dropJunk: DropJunk = useCallback(() => {
    setState((draft) => {
      draft.playerAction = "DROPPING";
    });
  }, [setState]);

  const floor = getInventory(state.floorIds[state.playerLocation]);

  const dropJunkItem: DropJunk = useCallback(() => {
    setState((draft) => {
      draft.playerAction = "IDLE";
      for (const id of bags) {
        const container = draft.purchasedContainerMap[id];
        for (const slotId of container.slotIds) {
          const item = draft.itemMap[draft.slotMap[slotId].itemId];
          if (item.rarity === "JUNK") {
            // const floorContainer = draft.purchasedContainerMap[floor.id];
            const target = findSlot({
              containerInv: floor,
              height: item.height,
              width: item.width,
              method: "vertical",
            });
            if (target) {
              moveSlot({
                containerId: floor.id,
                x: target.x,
                y: target.y,
                slotId,
              });
              return;
            }
          }
        }
      }
    });
  }, [bags, floor, moveSlot, setState]);

  const trash: Trash = useCallback(() => {
    setState((draft) => {
      for (const slot of floor.slots) {
        delete draft.itemMap[slot.item.id];
        delete draft.slotMap[slot.id];
      }
      draft.purchasedContainerMap[
        draft.floorIds[state.playerLocation]
      ].slotIds = [];
    });
  }, [floor.slots, setState, state.playerLocation]);

  useEffect(() => {
    setState((draft) => {
      draft.highestMoneys = Math.max(draft.highestMoneys, draft.moneys);
    });
  }, [setState, state.moneys]);

  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  });

  return {
    dropJunk,
    dropJunkItem,
    trash,
    floor,
    addSlot,
    buyContainerUpgrade,
    buyUpgrade,
    heldSlot,
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
    disable,
    enable,
    cheat,
    reset,
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

const randomLoot = (available: ItemDefinition[]): Item => {
  const itemDefinition = choice(available);
  const rarity = choice(getAvailableRarities(itemDefinition)) ?? "COMMON";
  let prefix, suffix;
  if (rarity !== "COMMON") {
    prefix = choice(getAvailableModifiers(itemDefinition, rarity, "PREFIX"));
    suffix = choice(getAvailableModifiers(itemDefinition, rarity, "SUFFIX"));
  }
  const modifiers = [prefix, suffix].filter(isNonNullable);
  const modifierMultiplier = modifiers.reduce((total, modifier) => {
    return modifier.power * total;
  }, 1);

  return {
    ...itemDefinition,
    id: uuid(),
    rarity,
    modifiers,
    value: itemDefinition.value * modifierMultiplier,
  };
};

const getAvailableRarities = (item: ItemDefinition) => {
  return Array.from(
    availableModifiers.reduce((available, modifier) => {
      if (modifier.categories.includes(item.category)) {
        for (const rarity of modifier.rarities) {
          available.add(rarity);
        }
      }
      return available;
    }, new Set<Rarity>()),
  );
};

const getAvailableModifiers = (
  item: ItemDefinition,
  rarity: Rarity,
  type: ModifierType,
) => {
  return availableModifiers.filter((modifier) => {
    return (
      modifier.rarities.includes(rarity) &&
      modifier.categories.includes(item.category) &&
      modifier.type === type
    );
  });
};
