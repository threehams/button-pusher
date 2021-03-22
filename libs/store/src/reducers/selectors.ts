import { PlayerLocation } from "@botnet/messages";
import { range } from "lodash";
import { createSelector } from "reselect";
import { createCachedSelector } from "re-reselect";
import { getTargetCoords } from "../getTargetCoords";
import { Inventory } from "../Inventory";
import { State } from "../State";
import {
  upgrades as availableUpgrades,
  availableContainers as availableContainers,
} from "@botnet/data";
import { PurchasedUpgradeMap } from "../PurchasedUpgradeMap";
import { FullSlot } from "../FullSlot";

type PlayerProps = {
  playerId: string;
};
export const selectAllInventory = createCachedSelector(
  (state: Pick<State, "players">, props: PlayerProps) =>
    state.players[props.playerId],
  (player) => {
    const { inventory } = player;
    let slots = 0;
    let full = true;
    let junk = false;
    for (const containerId of inventory.purchasedContainerIds) {
      const inv = selectInventory(
        { players: { [player.id]: player } },
        { containerId, playerId: player.id },
      );
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
  },
)((state, props) => {
  return props.playerId;
});

export const selectPurchasedUpgrades = createCachedSelector(
  (state: Pick<State, "players">, props: PlayerProps) =>
    state.players[props.playerId].skills,
  (skills) => {
    return Object.entries(skills).reduce((result, [id, purchasedUpgrade]) => {
      const upgrade = availableUpgrades[id];
      result[id] = {
        ...purchasedUpgrade,
        id,
        name: upgrade.name,
        upgradeName: upgrade.upgradeName,
        time: 2000 * (1 / (purchasedUpgrade.level + 1)),
        cost: upgrade.baseCost * (purchasedUpgrade.level + 1) ** 2,
      };
      return result;
    }, {} as PurchasedUpgradeMap);
  },
)((state, props) => {
  return props.playerId;
});

export const selectHeldSlot = createCachedSelector(
  (state: Pick<State, "players">, props: PlayerProps) =>
    state.players[props.playerId],
  ({ inventory }) => {
    const handContainer =
      inventory.purchasedContainerMap[inventory.handContainerId];
    const slotId = handContainer.slotIds[0];
    if (!slotId) {
      return undefined;
    }
    const slot = inventory.slotMap[slotId];
    const item = inventory.itemMap[slot.itemId];
    if (!item) {
      // eslint-disable-next-line no-console
      console.error("itemMap", inventory.itemMap);
      throw new Error(`Could not find item with ID: ${slot.itemId}`);
    }
    return {
      ...slot,
      item: inventory.itemMap[slot.itemId],
    };
  },
)((state, props) => {
  return props.playerId;
});

export const selectBags = createCachedSelector(
  (state: Pick<State, "players">, props: PlayerProps) =>
    state.players[props.playerId].inventory.purchasedContainerIds,
  (state: Pick<State, "players">, props: PlayerProps) =>
    state.players[props.playerId].inventory.purchasedContainerMap,
  (ids, map) => {
    return ids.filter((id) => {
      return map[id].type === "BAG";
    });
  },
)((state, props) => {
  return props.playerId;
});

export const selectCurrentCapacity = createCachedSelector(
  (state: Pick<State, "players">, props: PlayerProps) =>
    state.players[props.playerId],
  selectBags,
  (state, bags) => {
    return bags.reduce((sum, id) => {
      const { width, height } = state.inventory.purchasedContainerMap[id];
      return sum + width * height;
    }, 0);
  },
)((state, props) => {
  return props.playerId;
});

type SelectInventoryProps = {
  containerId: string;
  playerId: string;
};
export const selectInventory = createCachedSelector(
  (state: Pick<State, "players">, props: SelectInventoryProps) =>
    state.players[props.playerId].inventory.slotMap,
  (state: Pick<State, "players">, props: SelectInventoryProps) =>
    state.players[props.playerId].inventory.itemMap,
  (state: Pick<State, "players">, props: SelectInventoryProps) =>
    state.players[props.playerId].inventory.purchasedContainerMap,
  (state: Pick<State, "players">, props: SelectInventoryProps) =>
    state.players[props.playerId].inventory.purchasedContainerIds,
  selectHeldSlot,
  selectCurrentCapacity,
  (state: Pick<State, "players">, props: SelectInventoryProps) =>
    props.containerId,
  (
    slotMap,
    itemMap,
    purchasedContainerMap,
    purchasedContainerIds,
    heldSlot,
    currentCapacity,
    containerId,
  ) => {
    const container = purchasedContainerMap[containerId];
    const grid = initializeGrid({
      width: container.width,
      height: container.height,
    });
    const slots = container.slotIds.map((slotId) => {
      const slot = slotMap[slotId];
      return {
        ...slot,
        item: itemMap[slot.itemId],
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
      purchasedContainerIds.indexOf(containerId) ===
      purchasedContainerIds.length - 1;

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
    let allJunk = !!slots.length;
    for (const slot of slots) {
      if (slot.item.rarity === "JUNK") {
        junk = true;
      } else {
        allJunk = false;
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
      allJunk,
    };
  },
)((state, props) => {
  return `${props.containerId}${props.playerId}`;
});

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

const recalculateGrid = ({
  slots,
  grid,
}: {
  slots: FullSlot[];
  grid: (string | false)[][];
}) => {
  slots.forEach((slot) => {
    range(0, slot.item.height).forEach((row) => {
      range(0, slot.item.width).forEach((col) => {
        grid[slot.y + row][slot.x + col] = slot.id;
      });
    });
  });
};

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

type SortMethod = "horizontal" | "vertical";
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

export const selectInventoryPagination = createSelector(
  selectBags,
  (state: Pick<State, "players">, props: PlayerProps) =>
    state.players[props.playerId].inventory.currentContainerId,
  (bags, currentContainerId) => {
    const current = bags.indexOf(currentContainerId);
    const next = bags[current + 1];
    const prev = bags[current - 1];

    return {
      prev,
      next,
    };
  },
);

type SelectFloorProps = {
  playerLocation: PlayerLocation;
  playerId: string;
};
export const selectFloor = (
  state: Pick<State, "players">,
  props: SelectFloorProps,
) => {
  return selectInventory(state, {
    containerId:
      state.players[props.playerId].inventory.floorIds[props.playerLocation],
    playerId: props.playerId,
  });
};
