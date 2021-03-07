import { PlayerAction } from "@botnet/messages";
import {
  AllInventory,
  DropJunkItem,
  DropJunk,
  PurchasedUpgrade,
} from "@botnet/store";

type AutoDropJunk = {
  upgrade: PurchasedUpgrade;
  autoUpgrade: PurchasedUpgrade;
  lastDropJunk: number;
  setLastDropJunk: (value: number) => void;
  lastAutoDropJunk: number;
  setLastAutoDropJunk: (value: number) => void;
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
  lastAutoDropJunk,
  lastDropJunk,
  setLastAutoDropJunk,
  setLastDropJunk,
}: AutoDropJunk) => {
  if (playerAction === "DROPPING" && allInventory.junk) {
    setLastDropJunk(lastDropJunk + delta);
    if (lastDropJunk > upgrade.time) {
      dropJunkItem();
      setLastDropJunk(0);
    }
  }

  if (
    allInventory.junk &&
    autoUpgrade.level &&
    autoUpgrade.enabled &&
    playerAction === "IDLE"
  ) {
    setLastAutoDropJunk(lastAutoDropJunk + delta);
    if (lastAutoDropJunk > autoUpgrade.time) {
      dropJunk();
      setLastAutoDropJunk(0);
    }
  }
};
