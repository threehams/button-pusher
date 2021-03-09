import { Item, PlayerAction, PlayerLocation, Slot } from "@botnet/messages";
import React, { useContext } from "react";
import { AllInventory } from "./AllInventory";
import { Inventory } from "./Inventory";
import { PurchasedUpgradeMap } from "./PurchasedUpgradeMap";
import {
  AddSlot,
  Adventure,
  Arrive,
  BuyContainer,
  BuyContainerUpgrade,
  BuyUpgrade,
  GoInventory,
  Loot,
  MoveSlot,
  NextInventory,
  Pack,
  PrevInventory,
  Sell,
  SellItem,
  Sort,
  StoreHeldItem,
  Travel,
  Disable,
  Enable,
  Cheat,
  Reset,
  Trash,
  DropJunk,
  DropJunkItem,
  TrashAll,
  StartSort,
} from "./useStore";

export type StoreContextType = {
  addSlot: AddSlot;
  adventure: Adventure;
  allInventory: AllInventory;
  arrive: Arrive;
  buyContainer: BuyContainer;
  buyContainerUpgrade: BuyContainerUpgrade;
  buyUpgrade: BuyUpgrade;
  cheat: Cheat;
  disable: Disable;
  dropJunk: DropJunk;
  dropJunkItem: DropJunkItem;
  enable: Enable;
  floor: Inventory;
  goInventory: GoInventory;
  heldSlot: (Slot & { item: Item }) | undefined;
  highestMoneys: number;
  inventory: Inventory;
  loot: Loot;
  moneys: number;
  moveSlot: MoveSlot;
  nextInventory: NextInventory;
  pack: Pack;
  playerAction: PlayerAction;
  playerDestination: PlayerLocation | undefined;
  playerLocation: PlayerLocation;
  prevInventory: PrevInventory;
  purchasedUpgrades: PurchasedUpgradeMap;
  reset: Reset;
  sell: Sell;
  sellItem: SellItem;
  sort: Sort;
  startSort: StartSort;
  storeHeldItem: StoreHeldItem;
  trash: Trash;
  trashAll: TrashAll;
  travel: Travel;
};

const StoreContext = React.createContext<StoreContextType>(undefined as any);

type StoreProviderProps = {
  value: StoreContextType;
  children: React.ReactNode;
};
export const StoreProvider = ({ value, children }: StoreProviderProps) => {
  return (
    <StoreContext.Provider value={value}>{children} </StoreContext.Provider>
  );
};

export const useStoreValue = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("StoreContext not found");
  }
  return context;
};
