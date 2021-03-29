import { useLoop } from "@botnet/worker";
import { ProgressContextType } from "../ProgressContext";
import { autoDropJunk } from "./autoDropJunk";
import { autoStore } from "./autoStore";
import { autoSell } from "./autoSell";
import { autoSort } from "./autoSort";
import { autoTrash } from "./autoTrash";
import { autoTravel } from "./autoTravel";
import { autoKill } from "./autoKill";
import { getInitialLastTimes, useLastTimes } from "./lastTimes";
import { useDispatch, useSelector, useStore } from "react-redux";
import {
  selectInventory,
  selectHeldSlot,
  selectAllInventory,
  selectPurchasedUpgrades,
  selectFloor,
  State,
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
  const store = useStore<State>();
  const playerIds = useSelector((state) => Object.keys(state.players));

  const { allTimes, getPlayerTimes, setLastTime } = useLastTimes();
  const dispatch = useDispatch();

  const loop = (delta: number) => {
    for (const playerId of playerIds) {
      for (const updater of updateList) {
        const state = store.getState();
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

        if (
          updater({
            dispatch,
            player,
            delay,
            upgrades,
            allInventory,
            heldSlot,
            floor,
            inventory,
            playerId,
          })
        ) {
          break;
        }
      }
    }
  };
  useLoop(loop);

  return Object.fromEntries(
    playerIds.map((id) => {
      return [id, allTimes[id] ?? getInitialLastTimes()];
    }),
  );
};
