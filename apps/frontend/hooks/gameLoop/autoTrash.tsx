import { PlayerAction } from "@botnet/messages";
import {
  AllInventory,
  TrashAll,
  Trash,
  PurchasedUpgrade,
  Inventory,
} from "@botnet/store";
import { LastTimes, SetLastTime } from "./lastTimes";

type AutoTrash = {
  upgrade: PurchasedUpgrade;
  autoUpgrade: PurchasedUpgrade;
  trash: Trash;
  trashAll: TrashAll;
  delta: number;
  playerAction: PlayerAction;
  floor: Inventory;
  lastTimes: LastTimes;
  setLastTime: SetLastTime;
};
export const autoTrash = ({
  autoUpgrade,
  upgrade,
  delta,
  playerAction,
  floor,
  trash,
  trashAll,
  lastTimes,
  setLastTime,
}: AutoTrash) => {
  if (playerAction === "TRASHING") {
    setLastTime("trash", lastTimes.trash + delta);
    if (lastTimes.trash > upgrade.time) {
      trashAll();
      setLastTime("trash", 0);
    }
  }

  if (
    floor.allJunk &&
    floor.full &&
    autoUpgrade.level &&
    autoUpgrade.enabled &&
    playerAction === "IDLE"
  ) {
    setLastTime("autoTrash", lastTimes.autoTrash + delta);
    if (lastTimes.autoTrash > autoUpgrade.time) {
      trash();
      setLastTime("autoTrash", 0);
    }
  }
};
