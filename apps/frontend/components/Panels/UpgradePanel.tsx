import { BuyUpgrade, PurchasedUpgradeMap } from "@botnet/store";
import { css } from "@emotion/react";
import React from "react";
import { Button } from "../Button";

type UpgradePanelProps = {
  upgrades: PurchasedUpgradeMap;
  buyUpgrade: BuyUpgrade;
  highestMoneys: number;
  moneys: number;
};
export const UpgradePanel = ({
  upgrades,
  buyUpgrade,
  highestMoneys,
  moneys,
}: UpgradePanelProps) => {
  if (!upgrades) {
    return <div>Nothing here</div>;
  }
  return (
    <div>
      <h1
        css={css`
          margin-bottom: 20px;
        `}
      >
        Upgrades
      </h1>
      <ul
        css={css`
          & > * {
            margin-bottom: 10px;
          }
        `}
      >
        {[
          upgrades.KILL,
          upgrades.PACK,
          upgrades.SELL,
          upgrades.SORT,
          upgrades.TRAVEL,
        ].map((upgrade) => {
          if (upgrade.level === 0 && upgrade.cost > highestMoneys) {
            return null;
          }
          return (
            <Button
              css={css`
                display: block;
                width: 100%;
              `}
              key={upgrade.name}
              disabled={!upgrade.cost || upgrade.cost > moneys}
              onClick={() => {
                buyUpgrade({ id: upgrade.id });
              }}
            >
              {upgrade.name} (${upgrade.cost})
            </Button>
          );
        })}
      </ul>
      <h1
        css={css`
          margin-bottom: 20px;
        `}
      >
        Automation
      </h1>
      <ul
        css={css`
          & > * {
            margin-bottom: 10px;
          }
        `}
      >
        {[
          upgrades.AUTOMATE_KILL,
          upgrades.AUTOMATE_PACK,
          upgrades.AUTOMATE_SELL,
          upgrades.AUTOMATE_SORT,
          upgrades.AUTOMATE_TRAVEL,
        ].map((upgrade) => {
          if (upgrade.level === 0 && upgrade.cost > highestMoneys) {
            return null;
          }
          return (
            <Button
              css={css`
                display: block;
                width: 100%;
              `}
              key={upgrade.name}
              disabled={!upgrade.cost || upgrade.cost > moneys}
              onClick={() => {
                buyUpgrade({ id: upgrade.id });
              }}
            >
              {upgrade.name} (${upgrade.cost})
            </Button>
          );
        })}
      </ul>
    </div>
  );
};
