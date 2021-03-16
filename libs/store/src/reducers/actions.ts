import { PlayerLocation, UpgradeType } from "@botnet/messages";
import { AutomatedUpgrade } from "../AutomatedUpgrade";

type Action<
  TName extends string,
  TPayload extends Record<string, unknown> = Record<string, undefined>,
  TMeta extends Record<string, unknown> = Record<string, undefined>
> = TPayload extends Record<string, undefined>
  ? {
      type: TName;
      meta?: TMeta;
    }
  : {
      type: TName;
      payload: TPayload;
      meta?: TMeta;
    };

export type LootAction = Action<"LOOT">;
export type MoveSlotAction = Action<
  "MOVE_SLOT",
  {
    slotId: string;
    x: number;
    y: number;
    containerId: string;
  }
>;
export type AddSlotAction = Action<
  "ADD_SLOT",
  {
    itemId: string;
    x: number;
    y: number;
    containerId: string;
  }
>;
export type BuyUpgradeAction = Action<"BUY_UPGRADE", { id: UpgradeType }>;
export type BuyContainerUpgradeAction = Action<
  "BUY_CONTAINER_UPGRADE",
  { id: string }
>;
export type PackAction = Action<"PACK">;
export type StoreHeldItemAction = Action<"STORE_HELD_ITEM">;
export type StartSortAction = Action<"START_SORT">;
export type SortAction = Action<"SORT">;
export type SellAction = Action<"SELL">;
export type TravelAction = Action<"TRAVEL", { destination: PlayerLocation }>;
export type AdventureAction = Action<"ADVENTURE">;
export type SellItemAction = Action<"SELL_ITEM">;
export type ArriveAction = Action<"ARRIVE">;
export type BuyContainerAction = Action<"BUY_CONTAINER">;
export type GoInventoryAction = Action<"GO_INVENTORY", { containerId: string }>;
export type DisableAction = Action<"DISABLE", { upgrade: AutomatedUpgrade }>;
export type EnableAction = Action<"ENABLE", { upgrade: AutomatedUpgrade }>;
export type CheatType = "AUTOMATION" | "MIDGAME";
export type CheatAction = Action<"CHEAT", { type: CheatType }>;
export type ResetAction = Action<"RESET">;
export type DropJunkAction = Action<"DROP_JUNK">;
export type DropJunkItemAction = Action<
  "DROP_JUNK_ITEM",
  { playerLocation: PlayerLocation }
>;
export type TrashAction = Action<"TRASH">;
export type TrashAllAction = Action<
  "TRASH_ALL",
  { playerLocation: PlayerLocation }
>;
export type AutoDropJunkAction = Action<"AUTO_DROP_JUNK">;
export type AutoKillAction = Action<"AUTO_KILL">;
export type AutoSellAction = Action<"AUTO_SELL">;
export type AutoSortAction = Action<"AUTO_SORT">;
export type AutoStoreAction = Action<"AUTO_STORE">;
export type AutoTrashAction = Action<"AUTO_TRASH">;
export type AutoTravelAction = Action<"AUTO_TRAVEL">;

export type AnyAction =
  | AutoDropJunkAction
  | AutoKillAction
  | AutoSellAction
  | AutoSortAction
  | AutoStoreAction
  | AutoTrashAction
  | AutoTravelAction
  | LootAction
  | MoveSlotAction
  | AddSlotAction
  | BuyUpgradeAction
  | BuyContainerUpgradeAction
  | PackAction
  | StoreHeldItemAction
  | StartSortAction
  | SortAction
  | SellAction
  | TravelAction
  | AdventureAction
  | SellItemAction
  | ArriveAction
  | BuyContainerAction
  | GoInventoryAction
  | DisableAction
  | EnableAction
  | CheatAction
  | ResetAction
  | DropJunkAction
  | DropJunkItemAction
  | TrashAction
  | TrashAllAction;
