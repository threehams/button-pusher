import {
  ItemMap,
  PlayerLocation,
  PlayerAction,
  PurchasedContainerMap,
  PurchasedUpgradeMapState,
  SlotMap,
  FloorContainerMap,
} from "@botnet/messages";
import {
  Array,
  Record,
  Static,
  String,
  Number,
  Undefined,
  Union,
} from "runtypes";

export const DataState = Record({
  playerLocation: PlayerLocation,
  handContainerId: String,
  floorIds: FloorContainerMap,
  purchasedContainerIds: Array(String),
  purchasedContainerMap: PurchasedContainerMap,
  currentContainerId: String,
  itemMap: ItemMap,
  slotMap: SlotMap,
  moneys: Number,
  purchasedUpgradeMap: PurchasedUpgradeMapState,
  playerAction: PlayerAction,
  playerDestination: Union(PlayerLocation, Undefined),
  highestMoneys: Number,
  sellableItems: Number,
});
export type DataState = Static<typeof DataState>;
