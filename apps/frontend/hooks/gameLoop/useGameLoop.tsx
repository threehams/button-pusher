import { StoreContextType } from "@botnet/store";
import { useLoop } from "@botnet/worker";
import { useState } from "react";
import { autoPack } from "./autoPack";
import { autoSell } from "./autoSell";
import { autoSort } from "./autoSort";
import { autoTravel } from "./autoTravel";
import { kill } from "./kill";

export const useGameLoop = ({
  loot,
  heldSlot,
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
  allInventory,
}: StoreContextType) => {
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
      heldSlot,
      loot,
      lastKill,
      setLastKill,
      delta,
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
      heldSlot,
      delta,
      lastPack,
      setLastPack,
      lastAutoPack,
      setLastAutoPack,
      playerAction,
      storeHeldItem,
      allInventory,
    });
    autoSort({
      upgrade: purchasedUpgrades.SORT,
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
      allInventory,
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
      allInventory,
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
    autoSortProgress: progress({
      last: lastSort,
      total: purchasedUpgrades.SORT.time,
    }),
    sellProgress: progress({
      last: lastSell,
      total: purchasedUpgrades.SELL.time,
    }),
    autoSellProgress: progress({
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
