import { StoreContextType } from "@botnet/store";
import { useLoop } from "@botnet/worker";
import { useState } from "react";
import { autoDropJunk } from "./autoDropJunk";
import { autoPack } from "./autoPack";
import { autoSell } from "./autoSell";
import { autoSort } from "./autoSort";
import { autoTrash } from "./autoTrash";
import { autoTravel } from "./autoTravel";
import { kill } from "./kill";

export const useGameLoop = ({
  adventure,
  allInventory,
  arrive,
  dropJunk,
  dropJunkItem,
  floor,
  heldSlot,
  inventory,
  loot,
  pack,
  playerAction,
  playerLocation,
  purchasedUpgrades,
  sell,
  sellItem,
  sort,
  startSort,
  storeHeldItem,
  trash,
  trashAll,
  travel,
}: StoreContextType) => {
  const [lastKill, setLastKill] = useState(0);
  const [lastAutoKill, setLastAutoKill] = useState(0);
  const [lastPack, setLastPack] = useState(0);
  const [lastAutoPack, setLastAutoPack] = useState(0);
  const [lastSort, setLastSort] = useState(0);
  const [lastAutoSort, setLastAutoSort] = useState(0);
  const [lastTravel, setLastTravel] = useState(0);
  const [lastAutoTravel, setLastAutoTravel] = useState(0);
  const [lastSell, setLastSell] = useState(0);
  const [lastAutoSell, setLastAutoSell] = useState(0);
  const [lastDropJunk, setLastDropJunk] = useState(0);
  const [lastAutoDropJunk, setLastAutoDropJunk] = useState(0);
  const [lastTrash, setLastTrash] = useState(0);
  const [lastAutoTrash, setLastAutoTrash] = useState(0);

  const loop = (delta: number) => {
    kill({
      adventure,
      autoUpgrade: purchasedUpgrades.AUTOMATE_KILL,
      delta,
      heldSlot,
      lastAutoKill,
      lastKill,
      loot,
      playerAction,
      playerLocation,
      setLastAutoKill,
      setLastKill,
      upgrade: purchasedUpgrades.KILL,
    });
    autoPack({
      allInventory,
      autoUpgrade: purchasedUpgrades.AUTOMATE_PACK,
      delta,
      heldSlot,
      lastAutoPack,
      lastPack,
      pack,
      playerAction,
      setLastAutoPack,
      setLastPack,
      storeHeldItem,
      upgrade: purchasedUpgrades.PACK,
    });
    autoSort({
      autoUpgrade: purchasedUpgrades.AUTOMATE_SORT,
      delta,
      inventory,
      lastAutoSort,
      lastSort,
      playerAction,
      setLastAutoSort,
      setLastSort,
      sort,
      startSort,
      upgrade: purchasedUpgrades.SORT,
    });
    autoDropJunk({
      allInventory,
      autoUpgrade: purchasedUpgrades.AUTOMATE_DROP_JUNK,
      delta,
      dropJunk,
      dropJunkItem,
      lastAutoDropJunk,
      lastDropJunk,
      playerAction,
      setLastAutoDropJunk,
      setLastDropJunk,
      upgrade: purchasedUpgrades.DROP_JUNK,
    });
    autoTrash({
      allInventory,
      autoUpgrade: purchasedUpgrades.AUTOMATE_TRASH,
      delta,
      floor,
      lastAutoTrash,
      lastTrash,
      playerAction,
      setLastAutoTrash,
      setLastTrash,
      trash,
      trashAll,
      upgrade: purchasedUpgrades.TRASH,
    });
    autoTravel({
      allInventory,
      arrive,
      autoUpgrade: purchasedUpgrades.AUTOMATE_TRAVEL,
      delta,
      lastAutoTravel,
      lastTravel,
      playerAction,
      playerLocation,
      setLastAutoTravel,
      setLastTravel,
      travel,
      upgrade: purchasedUpgrades.TRAVEL,
    });
    autoSell({
      adventure,
      allInventory,
      autoUpgrade: purchasedUpgrades.AUTOMATE_SELL,
      delta,
      lastAutoSell,
      lastSell,
      playerAction,
      playerLocation,
      sell,
      sellItem,
      setLastAutoSell,
      setLastSell,
      upgrade: purchasedUpgrades.SELL,
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
    autoSortProgress: progress({
      last: lastAutoSort,
      total: purchasedUpgrades.AUTOMATE_SORT.time,
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
    dropJunkProgress: progress({
      last: lastDropJunk,
      total: purchasedUpgrades.DROP_JUNK.time,
    }),
    autoDropJunkProgress: progress({
      last: lastAutoDropJunk,
      total: purchasedUpgrades.AUTOMATE_DROP_JUNK.time,
    }),
    trashProgress: progress({
      last: lastTrash,
      total: purchasedUpgrades.TRASH.time,
    }),
    autoTrashProgress: progress({
      last: lastAutoTrash,
      total: purchasedUpgrades.AUTOMATE_TRASH.time,
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
