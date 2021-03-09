import { useStoreValue } from "@botnet/store";
import { css } from "@emotion/react";
import { useProgress } from "../../hooks/ProgressContext";
import React from "react";
import { AutoAction } from "../AutoAction";

export const ActionPanel = () => {
  const {
    heldSlot,
    playerAction,
    inventory,
    purchasedUpgrades,
    playerLocation,
    startSort,
    pack,
    adventure,
    sell,
    travel,
    dropJunk,
  } = useStoreValue();
  const {
    killProgress,
    packProgress,
    sellProgress,
    travelProgress,
    dropJunkProgress,
    sortProgress,
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
      {!!purchasedUpgrades.DROP_JUNK.level && (
        <AutoAction
          disabled={!inventory.junk}
          percent={dropJunkProgress}
          upgrade={purchasedUpgrades.AUTOMATE_DROP_JUNK}
          upgradeName="AUTOMATE_DROP_JUNK"
          onClick={() => {
            dropJunk();
          }}
        >
          Drop Junk
        </AutoAction>
      )}
      {!!purchasedUpgrades.SORT.level && (
        <AutoAction
          disabled={!inventory.slots}
          percent={sortProgress}
          onClick={() => {
            startSort();
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
