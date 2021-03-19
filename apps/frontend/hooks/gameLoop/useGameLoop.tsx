import { useLoop } from "@botnet/worker";
import { ProgressContextType } from "../ProgressContext";
import { autoDropJunk } from "./autoDropJunk";
import { autoStore } from "./autoStore";
import { autoSell } from "./autoSell";
import { autoSort } from "./autoSort";
import { autoTrash } from "./autoTrash";
import { autoTravel } from "./autoTravel";
import { autoKill } from "./autoKill";
import { INITIAL_LAST_TIMES, useLastTimes } from "./lastTimes";
import { useDispatch, useSelector } from "react-redux";
import {
  selectInventory,
  selectHeldSlot,
  selectAllInventory,
  selectPurchasedUpgrades,
  selectFloor,
} from "@botnet/store";
import { createDelay } from "./delay";

const updateList = [
  autoDropJunk,
  autoTrash,
  autoStore,
  autoSort,
  autoKill,
  autoSell,
  autoTravel,
];

export const useGameLoop = (): ProgressContextType => {
  const state = useSelector((all) => all);

  const { allTimes, getPlayerTimes, setLastTime } = useLastTimes();
  const dispatch = useDispatch();

  const loop = (delta: number) => {
    for (const playerId of Object.keys(state.players)) {
      const inventory = selectInventory(state, {
        containerId: state.players[playerId].inventory.currentContainerId,
        playerId,
      });
      const allInventory = selectAllInventory(state, { playerId });
      const heldSlot = selectHeldSlot(state, { playerId });
      const player = state.players[playerId].location;
      const floor = selectFloor(state, {
        playerLocation: player.location,
        playerId,
      });
      const purchasedUpgrades = selectPurchasedUpgrades(state, { playerId });
      const lastTimes = getPlayerTimes(playerId);

      const upgrades = purchasedUpgrades;
      const delay = createDelay({
        delta,
        lastTimes,
        setLastTime,
        upgrades,
        playerId,
      });
      const updateProps = {
        dispatch,
        player,
        delay,
        upgrades,
        allInventory,
        heldSlot,
        floor,
        inventory,
        playerId,
      };

      for (const updater of updateList) {
        if (updater(updateProps)) {
          break;
        }
      }
    }
  };
  useLoop(loop);

  return Object.fromEntries(
    Object.keys(state.players).map((id) => {
      return [id, allTimes[id] ?? INITIAL_LAST_TIMES];
    }),
  );
};
