import { Player } from "@botnet/messages";
import { AllInventory, PurchasedUpgrade } from "@botnet/store";
import { Dispatch } from "react-redux";
import { LastTimes, SetLastTime } from "./lastTimes";

type AutoDropJunk = {
  upgrade: PurchasedUpgrade;
  autoUpgrade: PurchasedUpgrade;
  lastTimes: LastTimes;
  setLastTime: SetLastTime;
  dispatch: Dispatch;
  delta: number;
  player: Player;
  allInventory: AllInventory;
};
export const autoDropJunk = ({
  autoUpgrade,
  upgrade,
  delta,
  player,
  allInventory,
  dispatch,
  lastTimes,
  setLastTime,
}: AutoDropJunk) => {
  if (player.action === "DROPPING" && allInventory.junk) {
    setLastTime("dropJunk", lastTimes.dropJunk + delta);
    if (lastTimes.dropJunk > upgrade.time) {
      dispatch({
        type: "DROP_JUNK_ITEM",
        payload: { playerLocation: player.location },
      });
      setLastTime("dropJunk", 0);
    }
  }

  if (
    allInventory.junk &&
    autoUpgrade.level &&
    autoUpgrade.enabled &&
    player.action === "IDLE"
  ) {
    setLastTime("autoDropJunk", lastTimes.autoDropJunk + delta);
    if (lastTimes.autoDropJunk > autoUpgrade.time) {
      dispatch({ type: "DROP_JUNK" });
      setLastTime("autoDropJunk", 0);
    }
  }
};
