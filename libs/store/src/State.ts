import {
  ContainerMap,
  ItemMap,
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
  Boolean,
} from "runtypes";

export const State = Record({
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
  selling: Boolean,
});
export type State = Static<typeof State>;
