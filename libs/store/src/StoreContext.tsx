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
} from "./useStore";

export type StoreContextType = {
  storeHeldItem: StoreHeldItem;
  addSlot: AddSlot;
  buyContainerUpgrade: BuyContainerUpgrade;
  buyUpgrade: BuyUpgrade;
  heldSlot: (Slot & { item: Item }) | undefined;
  inventory: Inventory;
  moneys: number;
  moveSlot: MoveSlot;
  pack: Pack;
  purchasedUpgrades: PurchasedUpgradeMap;
  sell: Sell;
  loot: Loot;
  sort: Sort;
  adventure: Adventure;
  arrive: Arrive;
  playerAction: PlayerAction;
  playerLocation: PlayerLocation;
  playerDestination: PlayerLocation | undefined;
  sellItem: SellItem;
  travel: Travel;
  highestMoneys: number;
  nextInventory: NextInventory;
  prevInventory: PrevInventory;
  goInventory: GoInventory;
  buyContainer: BuyContainer;
  allInventory: AllInventory;
  disable: Disable;
  enable: Enable;
  reset: Reset;
  cheat: Cheat;
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
