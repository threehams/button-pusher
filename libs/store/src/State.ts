import {
  ContainerMap,
  ItemMap,
  PlayerLocation,
  PlayerAction,
  PurchasedContainerMap,
  PurchasedUpgradeMapState,
  SlotMap,
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

export const State = Record({
  playerLocation: PlayerLocation,
  handContainerId: String,
  floorContainerId: String,
  purchasedContainerIds: Array(String),
  purchasedContainerMap: PurchasedContainerMap,
  containerMap: ContainerMap,
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
export type State = Static<typeof State>;
