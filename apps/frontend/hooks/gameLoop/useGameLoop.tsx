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
import { UpgradeType } from "@botnet/messages";

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
    const getUpdateProps = ({
      upgrade,
      autoUpgrade,
    }: {
      upgrade: UpgradeType;
      autoUpgrade: UpgradeType;
    }) => {
      return {
        delta,
        dispatch,
        player,
        lastTimes,
        setLastTime,
        upgrade: purchasedUpgrades[upgrade],
        autoUpgrade: purchasedUpgrades[autoUpgrade],
        allInventory,
        heldSlot,
        floor,
        inventory,
      };
    };

    autoDropJunk(
      getUpdateProps({ upgrade: "dropJunk", autoUpgrade: "autoDropJunk" }),
    );
    autoTrash(getUpdateProps({ upgrade: "trash", autoUpgrade: "autoTrash" }));
    autoPack(getUpdateProps({ upgrade: "pack", autoUpgrade: "autoPack" }));
    autoSort(getUpdateProps({ upgrade: "sort", autoUpgrade: "autoSort" }));
    autoKill(getUpdateProps({ upgrade: "kill", autoUpgrade: "autoKill" }));
    autoSell(getUpdateProps({ upgrade: "sell", autoUpgrade: "autoSell" }));
    autoTravel(
      getUpdateProps({ upgrade: "travel", autoUpgrade: "autoTravel" }),
    );
  };
  useLoop(loop);

  return Object.fromEntries(
    Object.entries(lastTimes).map(([name, lastTime]) => {
      return [name, (lastTime / purchasedUpgrades[name].time) * 100] as const;
    }),
  );
};
