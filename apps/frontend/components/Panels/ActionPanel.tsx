import { css } from "@emotion/react";
import { useProgress } from "../../hooks/ProgressContext";
import React from "react";
import { AutoAction } from "../AutoAction";
import { useDispatch, useSelector } from "react-redux";
import {
  selectHeldSlot,
  selectInventory,
  selectPurchasedUpgrades,
} from "@botnet/store";

export const ActionPanel = () => {
  const heldSlot = useSelector(selectHeldSlot);
  const player = useSelector((state) => state.player);
  const purchasedUpgrades = useSelector(selectPurchasedUpgrades);
  const inventory = useSelector((state) => {
    const containerId = state.data.currentContainerId;
    return selectInventory(state, { containerId });
  });
  const progress = useProgress();
  const dispatch = useDispatch();

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
            player.location === "KILLING_FIELDS" &&
            player.action === "IDLE" &&
            !heldSlot
          )
        }
        upgrade={purchasedUpgrades.autoKill}
        upgradeName="autoKill"
        onClick={() => {
          dispatch({ type: "ADVENTURE" });
        }}
      >
        Kill something {player.location === "TOWN" && "(not in town)"}
      </AutoAction>
      {!!purchasedUpgrades.pack.level && (
        <AutoAction
          disabled={!(heldSlot && player.action === "IDLE" && !inventory.full)}
          percent={progress.pack}
          upgrade={purchasedUpgrades.autoPack}
          upgradeName="autoPack"
          onClick={() => {
            dispatch({ type: "PACK" });
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
            dispatch({ type: "DROP_JUNK" });
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
            dispatch({ type: "START_SORT" });
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
            player.location === "TOWN" &&
            player.action !== "TRAVELLING" &&
            !!inventory.slots.length
          )
        }
        upgrade={purchasedUpgrades.autoSell}
        upgradeName="autoSell"
        onClick={() => {
          dispatch({ type: "SELL" });
        }}
      >
        Sell something {player.location !== "TOWN" && "(only in town)"}
      </AutoAction>
      <AutoAction
        upgrade={purchasedUpgrades.autoTravel}
        upgradeName="autoTravel"
        disabled={player.action === "TRAVELLING"}
        percent={progress.travel}
        onClick={() => {
          const destination =
            player.location === "TOWN" ? "KILLING_FIELDS" : "TOWN";
          dispatch({
            type: "TRAVEL",
            payload: {
              destination,
            },
          });
        }}
      >
        Travel to{" "}
        {player.location === "KILLING_FIELDS" ? "Town" : "the Killing Fields"}
      </AutoAction>
    </>
  );
};
