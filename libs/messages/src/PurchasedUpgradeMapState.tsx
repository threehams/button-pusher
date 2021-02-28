import { Record, Static } from "runtypes";
import { PurchasedUpgradeState } from "./PurchasedUpgradeState";

export const PurchasedUpgradeMapState = Record({
  APPRAISE: PurchasedUpgradeState,
  AUTOMATE_APPRAISE: PurchasedUpgradeState,
  PACK: PurchasedUpgradeState,
  AUTOMATE_PACK: PurchasedUpgradeState,
  SELL: PurchasedUpgradeState,
  AUTOMATE_SELL: PurchasedUpgradeState,
  SORT: PurchasedUpgradeState,
  AUTOMATE_SORT: PurchasedUpgradeState,
  TRAVEL: PurchasedUpgradeState,
  AUTOMATE_TRAVEL: PurchasedUpgradeState,
  KILL: PurchasedUpgradeState,
  AUTOMATE_KILL: PurchasedUpgradeState,
});
export type PurchasedUpgradeMapState = Static<typeof PurchasedUpgradeMapState>;
