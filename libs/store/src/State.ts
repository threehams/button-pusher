import { ContainerMap, ItemMap, SlotMap } from "@botnet/messages";
import { Array, Record, Static, String, Undefined, Union } from "runtypes";

export const State = Record({
  messages: Array(String),
  heldItemId: Union(String, Undefined),
  containerIds: Array(String),
  containerMap: ContainerMap,
  itemMap: ItemMap,
  slotMap: SlotMap,
  currentContainerId: Union(String, Undefined),
});
export type State = Static<typeof State>;
