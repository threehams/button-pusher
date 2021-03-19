import { useProgress } from "../../hooks/ProgressContext";
import React from "react";
import { AutoAction } from "../AutoAction";
import { useDispatch, useSelector } from "react-redux";
import {
  selectHeldSlot,
  selectInventory,
  selectPurchasedUpgrades,
} from "@botnet/store";
import { usePlayerId } from "apps/frontend/hooks/PlayerContext";

export const ActionPanel = () => {
  const playerId = usePlayerId();
  const player = useSelector((state) => state.players[playerId].location);
  const heldSlot = useSelector((state) => selectHeldSlot(state, { playerId }));
  const purchasedUpgrades = useSelector((state) =>
    selectPurchasedUpgrades(state, { playerId }),
  );
  const inventory = useSelector((state) => {
    const containerId = state.players[playerId].inventory.currentContainerId;
    return selectInventory(state, { containerId, playerId });
  });
  const progress = useProgress();
  const dispatch = useDispatch();

  return (
    <>
      <h1 className="mb-3">Actions</h1>
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
          dispatch({ type: "ADVENTURE", payload: { playerId } });
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
            dispatch({ type: "PACK", payload: { playerId } });
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
            dispatch({ type: "DROP_JUNK", payload: { playerId } });
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
            dispatch({ type: "START_SORT", payload: { playerId } });
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
          dispatch({ type: "SELL", payload: { playerId } });
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
              playerId,
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
