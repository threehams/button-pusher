import { AvailableUpgrade, BuyUpgrade } from "@botnet/store";
import React from "react";

type UpgradePanelProps = {
  upgrades: AvailableUpgrade[];
  buyUpgrade: BuyUpgrade;
};
export const UpgradePanel = ({ upgrades, buyUpgrade }: UpgradePanelProps) => {
  if (!upgrades) {
    return <div>Nothing here</div>;
  }
  return (
    <ul>
      {upgrades.map(({ id, level, name, canAfford, cost }) => {
        return (
          <li key={name}>
            <button
              disabled={!canAfford}
              onClick={() => {
                buyUpgrade({ id, level });
              }}
            >
              Buy {name} ${cost}
            </button>
          </li>
        );
      })}
    </ul>
  );
};
