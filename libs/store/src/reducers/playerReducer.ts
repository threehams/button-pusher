import produce from "immer";
import { PlayerState } from "../PlayerState";
import { AnyAction } from "./actions";

const INITIAL_STATE: PlayerState = {
  playerAction: "IDLE" as const,
  playerLocation: "TOWN" as const,
  playerDestination: undefined,
};

export const playerReducer = (
  state: PlayerState = INITIAL_STATE,
  action: AnyAction,
): PlayerState => {
  return produce(state, (draft) => {
    switch (action.type) {
      case "ADVENTURE":
        draft.playerAction = "KILLING";
        break;
      case "ARRIVE":
        if (draft.playerDestination) {
          draft.playerLocation = draft.playerDestination;
          draft.playerDestination = undefined;
          draft.playerAction = "IDLE";
        } else {
          throw new Error("somehow ended up arriving without a destination");
        }
        break;
      case "DROP_JUNK":
        draft.playerAction = "DROPPING";
        break;
      case "DROP_JUNK_ITEM": {
        draft.playerAction = "IDLE";
        break;
      }
      case "LOOT": {
        draft.playerAction = "IDLE";
        break;
      }
      case "PACK":
        draft.playerAction = "STORING";
        break;
      case "RESET":
        return INITIAL_STATE;
      case "SELL":
        draft.playerLocation = "TOWN";
        draft.playerAction = "SELLING";
        break;
      case "SELL_ITEM": {
        draft.playerAction = "IDLE";
        break;
      }
      case "SORT": {
        draft.playerAction = "IDLE";
        break;
      }
      case "START_SORT":
        draft.playerAction = "SORTING";
        break;
      case "STORE_HELD_ITEM": {
        draft.playerAction = "IDLE";
        break;
      }
      case "TRASH":
        draft.playerAction = "TRASHING";
        break;
      case "TRASH_ALL": {
        draft.playerAction = "IDLE";
        break;
      }
      case "TRAVEL":
        draft.playerAction = "TRAVELLING";
        draft.playerDestination = action.payload.destination;
        break;
      default:
        return draft;
    }
  });
};
