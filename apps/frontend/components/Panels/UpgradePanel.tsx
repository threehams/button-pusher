import { PurchasedUpgrade, selectPurchasedUpgrades } from "@botnet/store";
import { usePlayerId } from "apps/frontend/hooks/PlayerContext";
import clsx from "clsx";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../Button";

export const UpgradePanel = () => {
  const playerId = usePlayerId();
  const moneys = useSelector((state) => state.players[playerId].moneys.moneys);
  const highestMoneys = useSelector(
    (state) => state.players[playerId].moneys.highestMoneys,
  );
  const purchasedUpgrades = useSelector((state) =>
    selectPurchasedUpgrades(state, { playerId }),
  );
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
  const playerId = usePlayerId();
  return (
    <Button
      className={clsx("flex justify-between w-full", className)}
      disabled={!upgrade.cost || upgrade.cost > moneys}
      onClick={() => {
        dispatch({
          type: "BUY_UPGRADE",
          payload: { id: upgrade.id, playerId, cost: upgrade.cost },
        });
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
