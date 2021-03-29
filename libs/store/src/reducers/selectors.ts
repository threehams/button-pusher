import { PlayerLocation } from "@botnet/messages";
import { createCachedSelector } from "re-reselect";
import { State } from "../State";
import {
  upgrades as availableUpgrades,
  availableContainers as availableContainers,
} from "@botnet/data";
import { PurchasedUpgradeMap } from "../PurchasedUpgradeMap";
import { findSlot } from "../findSlot";
import { recalculateGrid } from "./recalculateGrid";
import { getNextLevel } from "../getNextLevel";
import { initializeGrid } from "../initializeGrid";

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
        method: "horizontal",
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
