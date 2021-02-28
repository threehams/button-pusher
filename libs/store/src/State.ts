import {
  ContainerMap,
  ItemMap,
  PlayerLocation,
  PlayerAction,
  PurchasedContainerMap,
  PurchasedUpgradeMap,
  SlotMap,
  Upgrade,
} from "@botnet/messages";
import {
  Array,
  Record,
  Static,
  String,
  Number,
  Undefined,
  Union,
  Dictionary,
} from "runtypes";

export const State = Record({
  playerLocation: PlayerLocation,
  messages: Array(String),
  heldItemId: Union(String, Undefined),
  purchasedContainerMap: PurchasedContainerMap,
  containerMap: ContainerMap,
  currentContainerId: String,
  itemMap: ItemMap,
  slotMap: SlotMap,
  moneys: Number,
  upgradeMap: Dictionary(Upgrade),
  purchasedUpgradeMap: PurchasedUpgradeMap,
  playerAction: PlayerAction,
  playerDestination: Union(PlayerLocation, Undefined),
});
export type State = Static<typeof State>;
