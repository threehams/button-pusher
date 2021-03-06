import {
  AutomatedUpgrade,
  PurchasedUpgrade,
  useStoreValue,
} from "@botnet/store";
import { css } from "@emotion/react";
import { useProgress } from "../../hooks/ProgressContext";
import React from "react";
import { Progress } from "../Progress";
import { Button } from "../Button";

export const ActionPanel = () => {
  const {
    heldSlot,
    playerAction,
    inventory,
    purchasedUpgrades,
    playerLocation,
    sort,
    pack,
    adventure,
    sell,
    travel,
  } = useStoreValue();
  const {
    killProgress,
    packProgress,
    sellProgress,
    travelProgress,
  } = useProgress();

  return (
    <>
      <h1
        css={css`
          margin-bottom: 20px;
        `}
      >
        Actions
      </h1>
      <AutoAction
        percent={killProgress}
        disabled={
          !(
            playerLocation === "KILLING_FIELDS" &&
            playerAction === "IDLE" &&
            !heldSlot
          )
        }
        upgrade={purchasedUpgrades.AUTOMATE_KILL}
        upgradeName="AUTOMATE_KILL"
        onClick={() => {
          adventure();
        }}
      >
        Kill something {playerLocation === "TOWN" && "(not in town)"}
      </AutoAction>
      {!!purchasedUpgrades.PACK.level && (
        <AutoAction
          disabled={!(heldSlot && playerAction === "IDLE" && !inventory.full)}
          percent={packProgress}
          upgrade={purchasedUpgrades.AUTOMATE_PACK}
          upgradeName="AUTOMATE_PACK"
          onClick={() => {
            pack();
          }}
        >
          Store item
        </AutoAction>
      )}
      {!!purchasedUpgrades.SORT.level && (
        <AutoAction
          disabled={inventory.sorted || !inventory.slots}
          percent={0}
          onClick={() => {
            sort({ containerId: inventory.id });
          }}
          upgrade={purchasedUpgrades.AUTOMATE_SORT}
          upgradeName="AUTOMATE_SORT"
        >
          Sort
        </AutoAction>
      )}
      <AutoAction
        percent={sellProgress}
        disabled={
          !(
            playerLocation === "TOWN" &&
            playerAction !== "TRAVELLING" &&
            !!inventory.slots.length
          )
        }
        upgrade={purchasedUpgrades.AUTOMATE_SELL}
        upgradeName="AUTOMATE_SELL"
        onClick={() => {
          sell();
        }}
      >
        Sell something {playerLocation !== "TOWN" && "(only in town)"}
      </AutoAction>
      <AutoAction
        upgrade={purchasedUpgrades.AUTOMATE_TRAVEL}
        upgradeName="AUTOMATE_TRAVEL"
        disabled={playerAction === "TRAVELLING"}
        percent={travelProgress}
        onClick={() => {
          travel({
            destination: playerLocation === "TOWN" ? "KILLING_FIELDS" : "TOWN",
          });
        }}
      >
        Travel to{" "}
        {playerLocation === "KILLING_FIELDS" ? "Town" : "the Killing Fields"}
      </AutoAction>
    </>
  );
};

type AutoActionProps = {
  percent: number;
  children: React.ReactNode;
  disabled: boolean;
  onClick: React.MouseEventHandler;
  upgrade: PurchasedUpgrade;
  upgradeName: AutomatedUpgrade;
};
const AutoAction = ({
  children,
  disabled,
  onClick,
  upgrade,
  percent,
  upgradeName,
}: AutoActionProps) => {
  const { disable, enable } = useStoreValue();

  return (
    <div
      css={css`
        display: flex;
        flex: row nowrap;
      `}
    >
      <Progress button disabled={disabled} percent={percent} onClick={onClick}>
        {children}
      </Progress>
      <Button
        css={css`
          flex: 1 0 auto;
          margin-left: 20px;
        `}
        onClick={() => {
          upgrade.enabled ? disable(upgradeName) : enable(upgradeName);
        }}
      >
        Auto: {upgrade.enabled ? "On" : "Off"}
      </Button>
    </div>
  );
};
