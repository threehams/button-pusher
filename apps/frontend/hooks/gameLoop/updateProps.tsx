import { Item, Player, Slot } from "@botnet/messages";
import { AllInventory, Inventory, PurchasedUpgradeMap } from "@botnet/store";
import { Dispatch } from "react-redux";
import { Delay } from "./delay";

export type UpdateProps = {
  allInventory: AllInventory;
  upgrades: PurchasedUpgradeMap;
  dispatch: Dispatch;
  delay: Delay;
  player: Player;
  heldSlot: (Slot & { item: Item }) | undefined;
  floor: Inventory;
  inventory: Inventory;
};

export type Updater = (props: UpdateProps) => boolean;
