import { StoreContextType } from "@botnet/store";
import { useLoop } from "@botnet/worker";
import { ProgressContextType } from "../ProgressContext";
import { autoDropJunk } from "./autoDropJunk";
import { autoPack } from "./autoPack";
import { autoSell } from "./autoSell";
import { autoSort } from "./autoSort";
import { autoTrash } from "./autoTrash";
import { autoTravel } from "./autoTravel";
import { kill } from "./kill";
import { useLastTimes } from "./lastTimes";

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
}: StoreContextType): ProgressContextType => {
  const [lastTimes, setLastTime] = useLastTimes();

  const loop = (delta: number) => {
    kill({
      adventure,
      autoUpgrade: purchasedUpgrades.autoKill,
      delta,
      heldSlot,
      lastTimes,
      setLastTime,
      loot,
      playerAction,
      playerLocation,
      upgrade: purchasedUpgrades.kill,
    });
    autoPack({
      allInventory,
      autoUpgrade: purchasedUpgrades.autoPack,
      delta,
      heldSlot,
      pack,
      playerAction,
      storeHeldItem,
      upgrade: purchasedUpgrades.pack,
      lastTimes,
      setLastTime,
    });
    autoSort({
      autoUpgrade: purchasedUpgrades.autoSort,
      delta,
      inventory,
      playerAction,
      sort,
      startSort,
      upgrade: purchasedUpgrades.sort,
      lastTimes,
      setLastTime,
    });
    autoDropJunk({
      allInventory,
      autoUpgrade: purchasedUpgrades.autoDropJunk,
      delta,
      dropJunk,
      dropJunkItem,
      playerAction,
      upgrade: purchasedUpgrades.dropJunk,
      lastTimes,
      setLastTime,
    });
    autoTrash({
      autoUpgrade: purchasedUpgrades.autoTrash,
      delta,
      floor,
      playerAction,
      trash,
      trashAll,
      upgrade: purchasedUpgrades.trash,
      lastTimes,
      setLastTime,
    });
    autoTravel({
      allInventory,
      arrive,
      autoUpgrade: purchasedUpgrades.autoTravel,
      delta,
      playerAction,
      playerLocation,
      travel,
      upgrade: purchasedUpgrades.travel,
      lastTimes,
      setLastTime,
    });
    autoSell({
      adventure,
      allInventory,
      autoUpgrade: purchasedUpgrades.autoSell,
      delta,
      playerAction,
      playerLocation,
      sell,
      sellItem,
      upgrade: purchasedUpgrades.sell,
      lastTimes,
      setLastTime,
    });
  };
  useLoop(loop);

  return Object.fromEntries(
    Object.entries(lastTimes).map(([name, lastTime]) => {
      return [name, (lastTime / purchasedUpgrades[name].time) * 100] as const;
    }),
  );
};

// Can't figure out how to make this available normally
type ValueOf<T> = T[keyof T];
type UnionToIntersection<T> = (T extends T ? (p: T) => void : never) extends (
  p: infer U,
) => void
  ? U
  : never;
type FromEntries<T extends readonly [PropertyKey, any]> = T extends T
  ? Record<T[0], T[1]>
  : never;
type Flatten<T> = {} & {
  [P in keyof T]: T[P];
};
declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ObjectConstructor {
    keys<T>(o: T): Array<Extract<keyof T, string>>;
    entries<T extends { [key: string]: unknown }, K extends keyof T>(
      o: T,
    ): Array<[Extract<keyof T, string>, T[K]]>;
    values<T extends { [key: string]: any }>(o: T): ValueOf<T>[];
    fromEntries<
      V extends PropertyKey,
      T extends [readonly [V, any]] | Array<readonly [V, any]>
    >(
      entries: T,
    ): Flatten<UnionToIntersection<FromEntries<T[number]>>>;
  }
}
