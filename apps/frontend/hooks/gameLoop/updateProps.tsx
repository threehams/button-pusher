import { Item, Player, Slot } from "@botnet/messages";
import { AllInventory, Inventory, PurchasedUpgrade } from "@botnet/store";
import { Dispatch } from "react-redux";
import { LastTimes, SetLastTime } from "./lastTimes";

export type UpdateProps = {
  allInventory: AllInventory;
  autoUpgrade: PurchasedUpgrade;
  delta: number;
  dispatch: Dispatch;
  lastTimes: LastTimes;
  player: Player;
  setLastTime: SetLastTime;
  upgrade: PurchasedUpgrade;
  heldSlot: (Slot & { item: Item }) | undefined;
  floor: Inventory;
  inventory: Inventory;
};
