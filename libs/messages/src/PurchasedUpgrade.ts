import { Record, Number, Static } from "runtypes";

export const PurchasedUpgrade = Record({
  level: Number,
});
export type PurchasedUpgrade = Static<typeof PurchasedUpgrade>;
