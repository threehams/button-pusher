import { PlayerLocation, UpgradeType } from "@botnet/messages";
import { AutomatedUpgrade } from "../AutomatedUpgrade";

type PlayerAction<
  TName extends string,
  TPayload extends Record<string, unknown> = Record<string, undefined>,
> = TPayload extends Record<string, undefined>
  ? {
      type: TName;
      payload: { playerId: string };
    }
  : {
      type: TName;
      payload: TPayload & { playerId: string };
    };

type Action<
  TName extends string,
  TPayload extends Record<string, unknown> = Record<string, undefined>,
> = TPayload extends Record<string, undefined>
  ? {
      type: TName;
    }
  : {
      type: TName;
      payload: TPayload;
    };

export type LootAction = PlayerAction<"LOOT">;
export type MoveSlotAction = PlayerAction<
  "MOVE_SLOT",
  {
    slotId: string;
    x: number;
    y: number;
    containerId: string;
  }
>;
export type AddSlotAction = PlayerAction<
  "ADD_SLOT",
  {
    itemId: string;
    x: number;
    y: number;
    containerId: string;
  }
>;
export type BuyUpgradeAction = PlayerAction<
  "BUY_UPGRADE",
  { id: UpgradeType; cost: number }
>;
export type BuyContainerUpgradeAction = PlayerAction<
  "UPGRADE_CONTAINER",
  { id: string; cost: number }
>;
export type PackAction = PlayerAction<"PACK">;
export type StoreHeldItemAction = PlayerAction<
  "STORE_ITEM",
  { slotId: string }
>;
export type StartSortAction = PlayerAction<"START_SORT">;
export type SortAction = PlayerAction<"SORT">;
export type SellAction = PlayerAction<"SELL">;
export type TravelAction = PlayerAction<
  "TRAVEL",
  { destination: PlayerLocation }
>;
export type AdventureAction = PlayerAction<"ADVENTURE">;
export type SellItemAction = PlayerAction<"SELL_ITEM">;
export type ArriveAction = PlayerAction<"ARRIVE">;
export type BuyContainerAction = PlayerAction<
  "ADD_CONTAINER",
  { cost: number }
>;
export type DisableAction = PlayerAction<
  "DISABLE",
  { upgrade: AutomatedUpgrade }
>;
export type EnableAction = PlayerAction<
  "ENABLE",
  { upgrade: AutomatedUpgrade }
>;
export type DropJunkAction = PlayerAction<"DROP_JUNK">;
export type DropJunkItemAction = PlayerAction<
  "DROP_JUNK_ITEM",
  { playerLocation: PlayerLocation }
>;
export type TrashAction = PlayerAction<"TRASH">;
export type TrashAllAction = PlayerAction<
  "TRASH_ALL",
  { playerLocation: PlayerLocation }
>;
export type AutoDropJunkAction = PlayerAction<"AUTO_DROP_JUNK">;
export type AutoKillAction = PlayerAction<"AUTO_KILL">;
export type AutoSellAction = PlayerAction<"AUTO_SELL">;
export type AutoSortAction = PlayerAction<"AUTO_SORT">;
export type AutoStoreAction = PlayerAction<"AUTO_STORE">;
export type AutoTrashAction = PlayerAction<"AUTO_TRASH">;
export type AutoTravelAction = PlayerAction<"AUTO_TRAVEL">;
export type CreatePlayer = Action<
  "CREATE_PLAYER",
  {
    name: string;
  }
>;

export type CheatType = "AUTOMATION" | "MIDGAME";
export type CheatAction = PlayerAction<"CHEAT", { type: CheatType }>;
export type ResetAction = Action<"RESET">;

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
  | DisableAction
  | EnableAction
  | CheatAction
  | ResetAction
  | DropJunkAction
  | DropJunkItemAction
  | TrashAction
  | TrashAllAction
  | CreatePlayer;
