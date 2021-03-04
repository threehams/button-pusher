import { useStoreValue } from "@botnet/store";
import { css } from "@emotion/react";
import { useProgress } from "../../hooks/ProgressContext";
import React from "react";
import { Progress } from "../Progress";

export const ActionPanel = () => {
  const {
    heldItem,
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
      <Progress
        button
        percent={killProgress}
        disabled={
          !(
            playerLocation === "KILLING_FIELDS" &&
            playerAction === "IDLE" &&
            !heldItem
          )
        }
        css={css`
          display: block;
        `}
        onClick={() => {
          adventure();
        }}
      >
        Kill something {playerLocation === "TOWN" && "(not in town)"}
      </Progress>
      {!!purchasedUpgrades.PACK.level && (
        <Progress
          button
          disabled={!(heldItem && playerAction === "IDLE" && !inventory.full)}
          percent={packProgress}
          css={css`
            display: block;
          `}
          onClick={() => {
            pack();
          }}
        >
          Store item
        </Progress>
      )}
      {!!purchasedUpgrades.SORT.level && (
        <Progress
          button
          percent={0}
          onClick={() => {
            sort({ containerId: inventory.id });
          }}
        >
          Sort
        </Progress>
      )}
      <Progress
        button
        percent={sellProgress}
        disabled={
          !(
            playerLocation === "TOWN" &&
            playerAction !== "TRAVELLING" &&
            !!inventory.slots.length
          )
        }
        css={css`
          display: block;
        `}
        onClick={() => {
          sell();
        }}
      >
        Sell something {playerLocation !== "TOWN" && "(only in town)"}
      </Progress>
      <Progress
        button
        disabled={playerAction === "TRAVELLING"}
        percent={travelProgress}
        css={css`
          display: block;
        `}
        onClick={() => {
          travel({
            destination: playerLocation === "TOWN" ? "KILLING_FIELDS" : "TOWN",
          });
        }}
      >
        Travel to{" "}
        {playerLocation === "KILLING_FIELDS" ? "Town" : "the Killing Fields"}
      </Progress>
    </>
  );
};
