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
  const progress = useProgress();

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
        percent={progress.kill}
        disabled={
          !(
            playerLocation === "KILLING_FIELDS" &&
            playerAction === "IDLE" &&
            !heldSlot
          )
        }
        upgrade={purchasedUpgrades.autoKill}
        upgradeName="autoKill"
        onClick={() => {
          adventure();
        }}
      >
        Kill something {playerLocation === "TOWN" && "(not in town)"}
      </AutoAction>
      {!!purchasedUpgrades.pack.level && (
        <AutoAction
          disabled={!(heldSlot && playerAction === "IDLE" && !inventory.full)}
          percent={progress.pack}
          upgrade={purchasedUpgrades.autoPack}
          upgradeName="autoPack"
          onClick={() => {
            pack();
          }}
        >
          Store item
        </AutoAction>
      )}
      {!!purchasedUpgrades.dropJunk.level && (
        <AutoAction
          disabled={!inventory.junk}
          percent={progress.dropJunk}
          upgrade={purchasedUpgrades.autoDropJunk}
          upgradeName="autoDropJunk"
          onClick={() => {
            dropJunk();
          }}
        >
          Drop Junk
        </AutoAction>
      )}
      {!!purchasedUpgrades.sort.level && (
        <AutoAction
          disabled={!inventory.slots}
          percent={progress.sort}
          onClick={() => {
            startSort();
          }}
          upgrade={purchasedUpgrades.autoSort}
          upgradeName="autoSort"
        >
          Sort
        </AutoAction>
      )}
      <AutoAction
        percent={progress.sell}
        disabled={
          !(
            playerLocation === "TOWN" &&
            playerAction !== "TRAVELLING" &&
            !!inventory.slots.length
          )
        }
        upgrade={purchasedUpgrades.autoSell}
        upgradeName="autoSell"
        onClick={() => {
          sell();
        }}
      >
        Sell something {playerLocation !== "TOWN" && "(only in town)"}
      </AutoAction>
      <AutoAction
        upgrade={purchasedUpgrades.autoTravel}
        upgradeName="autoTravel"
        disabled={playerAction === "TRAVELLING"}
        percent={progress.travel}
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
