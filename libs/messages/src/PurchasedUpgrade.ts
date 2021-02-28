import { Record, Boolean, Number, Static } from "runtypes";

export const PurchasedUpgrade = Record({
  level: Number,
  enabled: Boolean,
});
export type PurchasedUpgrade = Static<typeof PurchasedUpgrade>;
