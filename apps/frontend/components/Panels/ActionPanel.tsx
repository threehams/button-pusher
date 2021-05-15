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
        className="last:mb-0 mb-2"
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
          className="last:mb-0 mb-2"
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
          className="last:mb-0 mb-2"
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
          className="last:mb-0 mb-2"
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
        className="last:mb-0 mb-2"
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
      {(player.location === "KILLING_FIELDS" || player.location === "SHOP") && (
        <AutoAction
          className="last:mb-0 mb-2"
          upgrade={purchasedUpgrades.autoTravel}
          upgradeName="autoTravel"
          disabled={player.action === "TRAVELLING"}
          percent={progress.travel}
          onClick={() => {
            dispatch({
              type: "TRAVEL",
              payload: {
                playerId,
                destination: "TOWN",
              },
            });
          }}
        >
          {player.location === "KILLING_FIELDS"
            ? "Travel to Town"
            : "Exit the Shop"}
        </AutoAction>
      )}
      {player.location === "TOWN" && (
        <AutoAction
          className="last:mb-0 mb-2"
          upgrade={purchasedUpgrades.autoTravel}
          upgradeName="autoTravel"
          disabled={player.action === "TRAVELLING"}
          percent={
            player.destination === "KILLING_FIELDS" ? progress.travel : 0
          }
          onClick={() => {
            dispatch({
              type: "TRAVEL",
              payload: {
                playerId,
                destination: "KILLING_FIELDS",
              },
            });
          }}
        >
          Travel to the Killing Fields
        </AutoAction>
      )}
      {player.location === "TOWN" && (
        <AutoAction
          className="last:mb-0 mb-2"
          upgrade={purchasedUpgrades.autoTravel}
          upgradeName="autoTravel"
          disabled={player.action === "TRAVELLING"}
          percent={player.destination === "SHOP" ? progress.travel : 0}
          onClick={() => {
            dispatch({
              type: "TRAVEL",
              payload: {
                playerId,
                destination: "SHOP",
              },
            });
          }}
        >
          Travel to the Shop
        </AutoAction>
      )}
    </>
  );
};
