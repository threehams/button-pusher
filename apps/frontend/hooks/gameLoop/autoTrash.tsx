import { PlayerAction } from "@botnet/messages";
import {
  AllInventory,
  TrashAll,
  Trash,
  PurchasedUpgrade,
  Inventory,
} from "@botnet/store";

type AutoTrash = {
  upgrade: PurchasedUpgrade;
  autoUpgrade: PurchasedUpgrade;
  lastTrash: number;
  setLastTrash: (value: number) => void;
  lastAutoTrash: number;
  setLastAutoTrash: (value: number) => void;
  trash: Trash;
  trashAll: TrashAll;
  delta: number;
  playerAction: PlayerAction;
  allInventory: AllInventory;
  floor: Inventory;
};
export const autoTrash = ({
  autoUpgrade,
  upgrade,
  delta,
  playerAction,
  floor,
  trash,
  trashAll,
  lastAutoTrash,
  lastTrash,
  setLastAutoTrash,
  setLastTrash,
}: AutoTrash) => {
  if (playerAction === "TRASHING") {
    setLastTrash(lastTrash + delta);
    if (lastTrash > upgrade.time) {
      trashAll();
      setLastTrash(0);
    }
  }

  if (
    floor.allJunk &&
    floor.full &&
    autoUpgrade.level &&
    autoUpgrade.enabled &&
    playerAction === "IDLE"
  ) {
    setLastAutoTrash(lastAutoTrash + delta);
    if (lastAutoTrash > autoUpgrade.time) {
      trash();
      setLastAutoTrash(0);
    }
  }
};
