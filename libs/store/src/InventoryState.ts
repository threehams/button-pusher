import {
  ItemMap,
  PurchasedContainerMap,
  SlotMap,
  FloorContainerMap,
} from "@botnet/messages";
import { Array, Record, Static, String } from "runtypes";

export const InventoryState = Record({
  currentContainerId: String,
  floorIds: FloorContainerMap,
  handContainerId: String,
  itemMap: ItemMap,
  purchasedContainerIds: Array(String),
  purchasedContainerMap: PurchasedContainerMap,
  slotMap: SlotMap,
});
export type InventoryState = Static<typeof InventoryState>;
