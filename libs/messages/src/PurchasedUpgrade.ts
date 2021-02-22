import { Record, Number, Static } from "runtypes";
import { UpgradeType } from "./Upgrade";

export const PurchasedUpgrade = Record({
  id: UpgradeType,
  level: Number,
});
export type PurchasedUpgrade = Static<typeof PurchasedUpgrade>;
