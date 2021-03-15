import { useLoop } from "@botnet/worker";
import { ProgressContextType } from "../ProgressContext";
import { autoDropJunk } from "./autoDropJunk";
import { autoPack } from "./autoPack";
import { autoSell } from "./autoSell";
import { autoSort } from "./autoSort";
import { autoTrash } from "./autoTrash";
import { autoTravel } from "./autoTravel";
import { autoKill } from "./autoKill";
import { useLastTimes } from "./lastTimes";
import { useDispatch, useSelector } from "react-redux";
import {
  selectInventory,
  selectHeldSlot,
  selectAllInventory,
  selectPurchasedUpgrades,
  selectFloor,
} from "@botnet/store";

export const useGameLoop = (): ProgressContextType => {
  const inventory = useSelector((state) => {
    return selectInventory(state, {
      containerId: state.data.currentContainerId,
    });
  });
  const allInventory = useSelector((state) => selectAllInventory(state));
  const heldSlot = useSelector((state) => selectHeldSlot(state));
  const player = useSelector((state) => state.player);
  const floor = useSelector((state) =>
    selectFloor(state, { playerLocation: player.location }),
  );
  const purchasedUpgrades = useSelector((state) =>
    selectPurchasedUpgrades(state),
  );

  const [lastTimes, setLastTime] = useLastTimes();
  const dispatch = useDispatch();

  const loop = (delta: number) => {
    autoDropJunk({
      allInventory,
      autoUpgrade: purchasedUpgrades.autoDropJunk,
      delta,
      dispatch,
      player,
      upgrade: purchasedUpgrades.dropJunk,
      lastTimes,
      setLastTime,
    });
    autoTrash({
      autoUpgrade: purchasedUpgrades.autoTrash,
      delta,
      floor,
      player,
      dispatch,
      upgrade: purchasedUpgrades.trash,
      lastTimes,
      setLastTime,
    });
    autoPack({
      allInventory,
      autoUpgrade: purchasedUpgrades.autoPack,
      delta,
      heldSlot,
      player,
      dispatch,
      upgrade: purchasedUpgrades.pack,
      lastTimes,
      setLastTime,
    });
    autoSort({
      autoUpgrade: purchasedUpgrades.autoSort,
      delta,
      inventory,
      player,
      dispatch,
      upgrade: purchasedUpgrades.sort,
      lastTimes,
      setLastTime,
    });
    autoKill({
      dispatch,
      autoUpgrade: purchasedUpgrades.autoKill,
      delta,
      heldSlot,
      lastTimes,
      setLastTime,
      player,
      upgrade: purchasedUpgrades.kill,
    });
    autoSell({
      dispatch,
      allInventory,
      autoUpgrade: purchasedUpgrades.autoSell,
      delta,
      player,
      upgrade: purchasedUpgrades.sell,
      lastTimes,
      setLastTime,
    });
    autoTravel({
      allInventory,
      dispatch,
      autoUpgrade: purchasedUpgrades.autoTravel,
      delta,
      player,
      upgrade: purchasedUpgrades.travel,
      lastTimes,
      setLastTime,
    });
  };
  useLoop(loop);

  return Object.fromEntries(
    Object.entries(lastTimes).map(([name, lastTime]) => {
      return [name, (lastTime / purchasedUpgrades[name].time) * 100] as const;
    }),
  );
};
