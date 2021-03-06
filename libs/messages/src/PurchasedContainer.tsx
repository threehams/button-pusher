import { Array, Boolean, String, Record, Number, Static } from "runtypes";
import { ContainerType } from "./ContainerType";

export const PurchasedContainer = Record({
  id: String,
  level: Number,
  width: Number,
  maxWidth: Number,
  type: ContainerType,
  height: Number,
  maxHeight: Number,
  slotIds: Array(String),
  sorted: Boolean,
});
export type PurchasedContainer = Static<typeof PurchasedContainer>;
