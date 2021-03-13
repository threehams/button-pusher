import { PlayerAction } from "@botnet/messages";
import {
  AllInventory,
  DropJunkItem,
  DropJunk,
  PurchasedUpgrade,
} from "@botnet/store";
import { LastTimes, SetLastTime } from "./lastTimes";

type AutoDropJunk = {
  upgrade: PurchasedUpgrade;
  autoUpgrade: PurchasedUpgrade;
  lastTimes: LastTimes;
  setLastTime: SetLastTime;
  dropJunk: DropJunk;
  dropJunkItem: DropJunkItem;
  delta: number;
  playerAction: PlayerAction;
  allInventory: AllInventory;
};
export const autoDropJunk = ({
  autoUpgrade,
  upgrade,
  delta,
  playerAction,
  allInventory,
  dropJunk,
  dropJunkItem,
  lastTimes,
  setLastTime,
}: AutoDropJunk) => {
  if (playerAction === "DROPPING" && allInventory.junk) {
    setLastTime("dropJunk", lastTimes.dropJunk + delta);
    if (lastTimes.dropJunk > upgrade.time) {
      dropJunkItem();
      setLastTime("dropJunk", 0);
    }
  }

  if (
    allInventory.junk &&
    autoUpgrade.level &&
    autoUpgrade.enabled &&
    playerAction === "IDLE"
  ) {
    setLastTime("autoDropJunk", lastTimes.autoDropJunk + delta);
    if (lastTimes.autoDropJunk > autoUpgrade.time) {
      dropJunk();
      setLastTime("autoDropJunk", 0);
    }
  }
};
