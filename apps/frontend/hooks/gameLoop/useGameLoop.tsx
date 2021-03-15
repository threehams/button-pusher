import { useLoop } from "@botnet/worker";
import { ProgressContextType } from "../ProgressContext";
import { autoDropJunk } from "./autoDropJunk";
import { autoPack } from "./autoPack";
import { autoSell } from "./autoSell";
import { autoSort } from "./autoSort";
import { autoTrash } from "./autoTrash";
import { autoTravel } from "./autoTravel";
import { kill } from "./kill";
import { useLastTimes } from "./lastTimes";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
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
  const floor = useSelector(selectFloor);
  const playerAction = useSelector((state) => state.data.playerAction);
  const playerLocation = useSelector((state) => state.data.playerLocation);
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
      playerAction,
      upgrade: purchasedUpgrades.dropJunk,
      lastTimes,
      setLastTime,
    });
    autoTrash({
      autoUpgrade: purchasedUpgrades.autoTrash,
      delta,
      floor,
      playerAction,
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
      playerAction,
      dispatch,
      upgrade: purchasedUpgrades.pack,
      lastTimes,
      setLastTime,
    });
    autoSort({
      autoUpgrade: purchasedUpgrades.autoSort,
      delta,
      inventory,
      playerAction,
      dispatch,
      upgrade: purchasedUpgrades.sort,
      lastTimes,
      setLastTime,
    });
    kill({
      dispatch,
      autoUpgrade: purchasedUpgrades.autoKill,
      delta,
      heldSlot,
      lastTimes,
      setLastTime,
      playerAction,
      playerLocation,
      upgrade: purchasedUpgrades.kill,
    });
    autoSell({
      dispatch,
      allInventory,
      autoUpgrade: purchasedUpgrades.autoSell,
      delta,
      playerAction,
      playerLocation,
      upgrade: purchasedUpgrades.sell,
      lastTimes,
      setLastTime,
    });
    autoTravel({
      allInventory,
      dispatch,
      autoUpgrade: purchasedUpgrades.autoTravel,
      delta,
      playerAction,
      playerLocation,
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
