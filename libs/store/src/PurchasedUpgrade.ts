import { UpgradeType } from "@botnet/messages";

export type PurchasedUpgrade = {
  id: UpgradeType;
  name: string;
  level: number;
  cost: number;
  time: number;
};
