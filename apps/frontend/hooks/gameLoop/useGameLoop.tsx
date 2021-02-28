import { Item, PlayerAction, PlayerLocation } from "@botnet/messages";
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
  PurchasedUpgradeMap,
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
  purchasedUpgrades: PurchasedUpgradeMap;
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
  purchasedUpgrades,
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
  const [lastAutoSell, setLastAutoSell] = useState(0);
  const [lastAutoTravel, setLastAutoTravel] = useState(0);
  const [lastTravel, setLastTravel] = useState(0);
  const [lastSell, setLastSell] = useState(0);

  const loop = (delta: number) => {
    kill({
      heldItem,
      loot,
      lastKill,
      setLastKill,
      delta,
      availableItems,
      playerAction,
      upgrade: purchasedUpgrades.KILL,
      autoUpgrade: purchasedUpgrades.AUTOMATE_KILL,
      lastAutoKill,
      setLastAutoKill,
      adventure,
      playerLocation,
    });
    autoPack({
      autoUpgrade: purchasedUpgrades.AUTOMATE_PACK,
      upgrade: purchasedUpgrades.PACK,
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
      autoUpgrade: purchasedUpgrades.AUTOMATE_SORT,
      sort,
      delta,
      lastSort,
      setLastSort,
      inventory,
    });
    autoTravel({
      lastAutoTravel,
      setLastAutoTravel,
      inventory,
      playerLocation,
      travel,
      arrive,
      delta,
      lastTravel,
      playerAction,
      setLastTravel,
      upgrade: purchasedUpgrades.TRAVEL,
      autoUpgrade: purchasedUpgrades.AUTOMATE_TRAVEL,
    });
    autoSell({
      autoUpgrade: purchasedUpgrades.AUTOMATE_SELL,
      upgrade: purchasedUpgrades.SELL,
      sell,
      delta,
      lastAutoSell,
      lastSell,
      setLastAutoSell,
      inventory,
      setLastSell,
      adventure,
      playerAction,
      playerLocation,
      sellItem,
    });
  };
  useLoop(loop);

  return {
    killProgress: progress({
      last: lastKill,
      total: purchasedUpgrades.KILL.time,
    }),
    autoKillProgress: progress({
      last: lastAutoKill,
      total: purchasedUpgrades.AUTOMATE_KILL.time,
    }),
    packProgress: progress({
      last: lastPack,
      total: purchasedUpgrades.PACK.time,
    }),
    autoPackProgress: progress({
      last: lastAutoPack,
      total: purchasedUpgrades.AUTOMATE_PACK.time,
    }),
    sortProgress: progress({
      last: lastSort,
      total: purchasedUpgrades.SORT.time,
    }),
    sellProgress: progress({
      last: lastAutoSell,
      total: purchasedUpgrades.AUTOMATE_SELL.time,
    }),
    travelProgress: progress({
      last: lastTravel,
      total: purchasedUpgrades.TRAVEL.time,
    }),
    autoTravelProgress: progress({
      last: lastAutoTravel,
      total: purchasedUpgrades.AUTOMATE_TRAVEL.time,
    }),
  };
};

type ProgressOptions = {
  total: number;
  last: number;
};
const progress = ({ last, total }: ProgressOptions) => {
  return (last / total) * 100;
};
