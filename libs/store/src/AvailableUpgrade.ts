import { UpgradeType } from "@botnet/messages";

export type AvailableUpgrade = {
  name: string;
  id: UpgradeType;
  cost: number;
  level: number;
  canAfford: boolean;
};
