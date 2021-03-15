import {
  items as availableItems,
  availableContainers as availableContainers,
  modifiers as availableModifiers,
} from "@botnet/data";
import {
  Item,
  ItemDefinition,
  ModifierType,
  PurchasedContainer,
  Rarity,
} from "@botnet/messages";
import { isNonNullable } from "@botnet/utils";
import produce, { Draft } from "immer";
import { range } from "lodash";
import { v4 as uuid } from "uuid";
import { choice } from "../choice";
import { DataState } from "../DataState";
import { findSlot } from "../findSlot";
import { getNextLevel } from "../getNextLevel";
import { initializeGrid } from "../initializeGrid";
import { AnyAction } from "./actions";
import {
  selectBags,
  selectCurrentCapacity,
  selectFloor,
  selectHeldSlot,
  selectInventory,
  selectPurchasedUpgrades,
} from "./selectors";

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

const INITIAL_STATE: DataState = {
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
    autoPack: {
      level: 0,
      enabled: true,
    },
    autoSell: {
      level: 0,
      enabled: true,
    },
    autoTravel: {
      level: 0,
      enabled: true,
    },
    autoSort: {
      level: 0,
      enabled: true,
    },
    sort: {
      level: 0,
      enabled: true,
    },
    pack: {
      level: 0,
      enabled: true,
    },
    autoKill: {
      level: 0,
      enabled: true,
    },
    kill: {
      level: 0,
      enabled: true,
    },
    sell: {
      level: 0,
      enabled: true,
    },
    travel: {
      level: 0,
      enabled: true,
    },
    dropJunk: {
      level: 0,
      enabled: true,
    },
    autoDropJunk: {
      level: 0,
      enabled: true,
    },
    trash: {
      level: 0,
      enabled: true,
    },
    autoTrash: {
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
  // playerAction: "IDLE" as const,
  // playerLocation: "TOWN" as const,
  // playerDestination: undefined,
  highestMoneys: 0,
  sellableItems: 0,
};

export const dataReducer = (
  state: DataState = INITIAL_STATE,
  action: AnyAction,
): DataState => {
  return produce(state, (draft) => {
    switch (action.type) {
      case "ADD_SLOT": {
        const { itemId, x, y, containerId } = action.payload;
        const slot = {
          id: uuid(),
          x,
          y,
          itemId,
          containerId,
        };

        // need to check overlaps here
        draft.slotMap[slot.id] = slot;
        draft.purchasedContainerMap[containerId].slotIds.push(slot.id);
        draft.purchasedContainerMap[containerId].sorted = false;
        break;
      }
      case "ARRIVE":
        draft.sellableItems = 1; // TODO probably get this from the action;
        break;
      case "BUY_CONTAINER": {
        const currentCapacity = selectCurrentCapacity({ data: state });
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
        break;
      }
      case "BUY_UPGRADE": {
        const { id } = action.payload;
        const purchasedUpgrades = selectPurchasedUpgrades({ data: state });
        const upgrade = purchasedUpgrades[id];
        if (draft.moneys >= upgrade.cost) {
          draft.moneys = draft.moneys - upgrade.cost;
          draft.purchasedUpgradeMap[id].level += 1;
        }
        break;
      }
      case "BUY_CONTAINER_UPGRADE": {
        const { id } = action.payload;
        const currentCapacity = selectCurrentCapacity({ data: state });
        const current = draft.purchasedContainerMap[id];
        const next = getNextLevel(current, currentCapacity);
        if (next.cost && draft.moneys >= next.cost) {
          draft.moneys = draft.moneys - next.cost;
          draft.purchasedContainerMap[id].level += 1;
          draft.purchasedContainerMap[id].width = next.width;
          draft.purchasedContainerMap[id].height = next.height;
        }
        break;
      }
      case "CHEAT":
        if (action.payload.type !== "AUTOMATION") {
          return state;
        }
        Object.values(draft.purchasedUpgradeMap).forEach((upgrade) => {
          upgrade.level += 1;
        });
        break;
      case "DISABLE":
        draft.purchasedUpgradeMap[action.payload.upgrade].enabled = false;
        break;
      case "DROP_JUNK_ITEM": {
        const { playerLocation } = action.payload;
        const bags = selectBags({ data: state });
        const floor = selectFloor({ data: state }, { playerLocation });
        for (const id of bags) {
          const container = draft.purchasedContainerMap[id];
          for (const slotId of container.slotIds) {
            const item = draft.itemMap[draft.slotMap[slotId].itemId];
            if (item.rarity === "JUNK") {
              const target = findSlot({
                containerInv: floor,
                height: item.height,
                width: item.width,
                method: "vertical",
              });
              if (target) {
                moveSlot(draft, {
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
        break;
      }
      case "ENABLE":
        draft.purchasedUpgradeMap[action.payload.upgrade].enabled = true;
        break;
      case "GO_INVENTORY": {
        draft.currentContainerId = action.payload.containerId;
        break;
      }
      case "LOOT": {
        const item = randomLoot(availableItems);
        draft.itemMap[item.id] = item;
        addSlot(draft, {
          containerId: draft.handContainerId,
          x: 0,
          y: 0,
          itemId: item.id,
        });
        break;
      }
      case "MOVE_SLOT": {
        moveSlot(draft, action.payload);
        break;
      }
      case "ADD_SLOT":
        addSlot(draft, action.payload);
        break;
      case "RESET":
        return INITIAL_STATE;
      case "SELL_ITEM": {
        const container = Object.values(draft.purchasedContainerMap).filter(
          (cont) =>
            cont.slotIds.length &&
            (cont.type === "BAG" || cont.type === "EQUIP"),
        )[0];
        if (!container) {
          return;
        }
        const slotId = container.slotIds[0];
        draft.moneys += Math.floor(
          draft.itemMap[draft.slotMap[slotId].itemId].value *
            getSellMultiplier(draft.sellableItems),
        );
        draft.highestMoneys = Math.max(draft.moneys, draft.highestMoneys);
        container.slotIds = container.slotIds.filter((id) => id !== slotId);
        draft.slotMap[slotId] = undefined!; // it's fine as long as I removed all references
        break;
      }
      case "SORT": {
        const container = state.purchasedContainerMap[state.currentContainerId];
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
        targetSlots.forEach((slot) => {
          draft.slotMap[slot.id].x = slot.x;
          draft.slotMap[slot.id].y = slot.y;
          draft.purchasedContainerMap[state.currentContainerId].sorted = true;
        });
        break;
      }
      case "STORE_HELD_ITEM": {
        const heldSlot = selectHeldSlot({ data: state });
        const bags = selectBags({ data: state });
        if (!heldSlot) {
          return;
        }
        const { width, height } = heldSlot.item;
        for (const containerId of bags) {
          const container = state.purchasedContainerMap[containerId];
          const containerInv = selectInventory(
            { data: state },
            { containerId: container.id },
          );
          const target = findSlot({
            containerInv,
            height,
            width,
            method: "horizontal",
          });
          if (target) {
            const { x, y } = target;
            moveSlot(draft, {
              containerId: container.id,
              slotId: heldSlot.id,
              x,
              y,
            });
            return;
          }
        }
        break;
      }
      case "TRASH_ALL": {
        const { playerLocation } = action.payload;
        const floor = selectFloor({ data: state }, { playerLocation });
        for (const slot of floor.slots) {
          delete draft.itemMap[slot.item.id];
          delete draft.slotMap[slot.id];
        }
        draft.purchasedContainerMap[
          draft.floorIds[playerLocation]
        ].slotIds = [];
        break;
      }
      case "TRAVEL":
        draft.sellableItems = 1;
        break;
      default:
        return draft;
    }
  });
};

type FullSlot = {
  id: string;
  x: number;
  y: number;
  item: Item;
  containerId: string;
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

type MoveSlot = {
  slotId: string;
  x: number;
  y: number;
  containerId: string;
};
const moveSlot = (
  draft: Draft<DataState>,
  { slotId, x, y, containerId }: MoveSlot,
) => {
  const slot = draft.slotMap[slotId];
  const currentContainerId = slot.containerId;
  if (currentContainerId !== containerId) {
    draft.purchasedContainerMap[
      currentContainerId
    ].slotIds = draft.purchasedContainerMap[currentContainerId].slotIds.filter(
      (currentSlotId) => currentSlotId !== slotId,
    );
    draft.purchasedContainerMap[containerId].slotIds.push(slot.id);
    draft.purchasedContainerMap[containerId].sorted = false;
  }
  slot.x = x;
  slot.y = y;
  slot.containerId = containerId;
};

type AddSlot = {
  itemId: string;
  x: number;
  y: number;
  containerId: string;
};
const addSlot = (
  draft: Draft<DataState>,
  { x, y, itemId, containerId }: AddSlot,
) => {
  const slot = {
    id: uuid(),
    x,
    y,
    itemId,
    containerId,
  };

  // need to check overlaps here
  draft.slotMap[slot.id] = slot;
  draft.purchasedContainerMap[containerId].slotIds.push(slot.id);
  draft.purchasedContainerMap[containerId].sorted = false;
};

// TODO move to shared place
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
