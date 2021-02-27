import { Record, Static } from "runtypes";
import { PurchasedUpgrade } from "./PurchasedUpgrade";

export const PurchasedUpgradeMap = Record({
  AUTOMATE_APPRAISE: PurchasedUpgrade,
  APPRAISE: PurchasedUpgrade,
  AUTOMATE_PACK: PurchasedUpgrade,
  AUTOMATE_SELL: PurchasedUpgrade,
  AUTOMATE_SORT: PurchasedUpgrade,
  SORT: PurchasedUpgrade,
  PACK: PurchasedUpgrade,
});
export type PurchasedUpgradeMap = Static<typeof PurchasedUpgradeMap>;
