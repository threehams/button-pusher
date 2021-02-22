import {
  ContainerMap,
  ItemMap,
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
  containerIds: Array(String),
  containerMap: ContainerMap,
  itemMap: ItemMap,
  slotMap: SlotMap,
  currentContainerId: Union(String, Undefined),
  moneys: Number,
  upgradeMap: Dictionary(Upgrade),
  purchasedUpgradeMap: PurchasedUpgradeMap,
});
export type State = Static<typeof State>;
