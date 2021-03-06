import { UpgradeType } from "@botnet/messages";

export type PurchasedUpgrade = {
  id: UpgradeType;
  name: string;
  upgradeName: string;
  enabled: boolean;
  level: number;
  cost: number;
  time: number;
};
