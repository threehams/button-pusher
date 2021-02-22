import { Record, Static } from "runtypes";
import { PurchasedUpgrade } from "./PurchasedUpgrade";

export const PurchasedUpgradeMap = Record({
  AUTOMATE_PACK: PurchasedUpgrade,
  AUTOMATE_SELL: PurchasedUpgrade,
  AUTOMATE_SORT: PurchasedUpgrade,
  SORT: PurchasedUpgrade,
});
export type PurchasedUpgradeMap = Static<typeof PurchasedUpgradeMap>;
