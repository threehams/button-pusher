import { Array, String, Record, Number, Static } from "runtypes";

export const PurchasedContainer = Record({
  id: String,
  level: Number,
  width: Number,
  height: Number,
  slotIds: Array(String),
});
export type PurchasedContainer = Static<typeof PurchasedContainer>;
