import { UpgradeType } from "@botnet/messages";
import { PurchasedUpgrade } from "./PurchasedUpgrade";

export type PurchasedUpgradeMap = {
  [Key in UpgradeType]: PurchasedUpgrade;
};
