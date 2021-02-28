import {
  Item,
  PlayerAction,
  PlayerLocation,
  PurchasedUpgradeMap,
} from "@botnet/messages";
import {
  Adventure,
  Arrive,
  Inventory,
  Pack,
  Sell,
  SellItem,
  Loot,
  Sort,
  Travel,
  StoreHeldItem,
} from "@botnet/store";
import { useLoop } from "@botnet/worker";
import { useState } from "react";
import { autoPack } from "./autoPack";
import { autoSell } from "./autoSell";
import { autoSort } from "./autoSort";
import { autoTravel } from "./autoTravel";
import { kill } from "./kill";

type UseGameLoop = {
  loot: Loot;
  heldItem: Item | undefined;
  availableItems: Item[];
  purchasedUpgradeMap: PurchasedUpgradeMap;
  pack: Pack;
  sort: Sort;
  sell: Sell;
  playerLocation: PlayerLocation;
  playerAction: PlayerAction;
  travel: Travel;
  adventure: Adventure;
  arrive: Arrive;
  sellItem: SellItem;
  inventory: Inventory;
  storeHeldItem: StoreHeldItem;
};
export const useGameLoop = ({
  loot,
  heldItem,
  availableItems,
  purchasedUpgradeMap,
  pack,
  sort,
  sell,
  inventory,
  adventure,
  arrive,
  playerAction,
  playerLocation,
  sellItem,
  storeHeldItem,
  travel,
}: UseGameLoop) => {
  const [lastKill, setLastKill] = useState(0);
  const [lastAutoKill, setLastAutoKill] = useState(0);
  const [lastPack, setLastPack] = useState(0);
  const [lastAutoPack, setLastAutoPack] = useState(0);
  const [lastSort, setLastSort] = useState(0);
  const [lastSell, setLastSell] = useState(0);
  const [lastTravel, setLastTravel] = useState(0);
  const [lastSellItem, setLastSellItem] = useState(0);

  const loop = (delta: number) => {
    kill({
      heldItem,
      loot,
      lastKill,
      setLastKill,
      delta,
      availableItems,
      playerAction,
      upgrade: purchasedUpgradeMap.AUTOMATE_KILL,
      lastAutoKill,
      setLastAutoKill,
      adventure,
      playerLocation,
    });
    autoPack({
      upgrade: purchasedUpgradeMap.AUTOMATE_PACK,
      pack,
      heldItem,
      delta,
      lastPack,
      setLastPack,
      lastAutoPack,
      setLastAutoPack,
      playerAction,
      storeHeldItem,
    });
    autoSort({
      upgrade: purchasedUpgradeMap.AUTOMATE_SORT,
      sort,
      delta,
      lastSort,
      setLastSort,
      inventory,
    });
    autoTravel({
      inventory,
      playerLocation,
      travel,
      arrive,
      delta,
      lastTravel,
      playerAction,
      setLastTravel,
      upgrade: purchasedUpgradeMap.AUTOMATE_TRAVEL,
    });
    autoSell({
      upgrade: purchasedUpgradeMap.AUTOMATE_SELL,
      sell,
      delta,
      lastSell,
      lastSellItem,
      setLastSell,
      inventory,
      setLastSellItem,
      adventure,
      playerAction,
      playerLocation,
      sellItem,
    });
  };
  useLoop(loop);

  return {
    killProgress: lastKill,
    packProgress: lastPack,
    sortProgress: lastSort,
    sellProgress: lastSell,
    travelProgress: lastTravel,
    sellItemProgress: lastSellItem,
  };
};
