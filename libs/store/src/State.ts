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
} from "runtypes";

export const State = Record({
  messages: Array(String),
  heldItemId: Union(String, Undefined),
  purchasedContainerMap: PurchasedContainerMap,
  containerMap: ContainerMap,
  currentContainerId: Union(String, Undefined),
  itemMap: ItemMap,
  slotMap: SlotMap,
  moneys: Number,
  upgradeMap: Dictionary(Upgrade),
  purchasedUpgradeMap: PurchasedUpgradeMap,
});
export type State = Static<typeof State>;
