import { PurchasedUpgrade, selectPurchasedUpgrades } from "@botnet/store";
import classNames from "classnames";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../Button";

export const UpgradePanel = () => {
  const moneys = useSelector((state) => state.data.moneys);
  const highestMoneys = useSelector((state) => state.data.highestMoneys);
  const purchasedUpgrades = useSelector(selectPurchasedUpgrades);
  if (!purchasedUpgrades) {
    return <div>Nothing here</div>;
  }
  const automationUpgrades = [
    purchasedUpgrades.autoKill,
    purchasedUpgrades.autoPack,
    purchasedUpgrades.autoSell,
    purchasedUpgrades.autoSort,
    purchasedUpgrades.autoTravel,
    purchasedUpgrades.autoDropJunk,
  ].filter((upgrade) => {
    return (
      upgrade.level > 0 ||
      (upgrade.cost > 0 && upgrade.cost <= highestMoneys * 2)
    );
  });

  const standardUpgrades = [
    purchasedUpgrades.kill,
    purchasedUpgrades.pack,
    purchasedUpgrades.sell,
    purchasedUpgrades.sort,
    purchasedUpgrades.travel,
    purchasedUpgrades.dropJunk,
  ].filter((upgrade) => {
    return (
      upgrade.level > 0 ||
      (upgrade.cost > 0 && upgrade.cost <= highestMoneys * 2)
    );
  });

  return (
    <div>
      {!!standardUpgrades.length && (
        <>
          <h1 className="mb-3">Upgrades</h1>
          <ul>
            {standardUpgrades.map((upgrade) => {
              return (
                <UpgradeButton
                  className="mb-2 last:mb-0"
                  key={upgrade.name}
                  moneys={moneys}
                  upgrade={upgrade}
                />
              );
            })}
          </ul>
        </>
      )}
      {!!automationUpgrades.length && (
        <>
          <h1 className="mb-3">Automation</h1>
          <ul>
            {automationUpgrades.map((upgrade) => {
              return (
                <UpgradeButton
                  className="mb-2 last:mb-0"
                  key={upgrade.name}
                  moneys={moneys}
                  upgrade={upgrade}
                />
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};

type UpgradeButtonProps = {
  upgrade: PurchasedUpgrade;
  moneys: number;
  className?: string;
};
const UpgradeButton = ({ upgrade, moneys, className }: UpgradeButtonProps) => {
  const dispatch = useDispatch();
  return (
    <Button
      className={classNames("flex justify-between w-full", className)}
      disabled={!upgrade.cost || upgrade.cost > moneys}
      onClick={() => {
        dispatch({ type: "BUY_UPGRADE", payload: { id: upgrade.id } });
      }}
    >
      <span>
        {upgrade.level ? upgrade.upgradeName : upgrade.name}{" "}
        {upgrade.level > 0 && `(${upgrade.level})`}
      </span>{" "}
      <span>${upgrade.cost}</span>
    </Button>
  );
};
