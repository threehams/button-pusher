import { Record, Boolean, Number, Static } from "runtypes";

export const PurchasedUpgradeState = Record({
  level: Number,
  enabled: Boolean,
});
export type PurchasedUpgradeState = Static<typeof PurchasedUpgradeState>;
