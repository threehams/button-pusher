import produce from "immer";
import { PlayerState } from "../PlayerState";
import { AnyAction } from "./actions";

const INITIAL_STATE: PlayerState = {
  action: "IDLE" as const,
  location: "TOWN" as const,
  destination: undefined,
};

export const playerReducer = (
  state: PlayerState = INITIAL_STATE,
  action: AnyAction,
): PlayerState => {
  return produce(state, (draft) => {
    switch (action.type) {
      case "ADVENTURE":
        draft.action = "KILLING";
        break;
      case "ARRIVE":
        if (draft.destination) {
          draft.location = draft.destination;
          draft.destination = undefined;
          draft.action = "IDLE";
        } else {
          throw new Error("somehow ended up arriving without a destination");
        }
        break;
      case "DROP_JUNK":
        draft.action = "DROPPING";
        break;
      case "DROP_JUNK_ITEM": {
        draft.action = "IDLE";
        break;
      }
      case "LOOT": {
        draft.action = "IDLE";
        break;
      }
      case "PACK":
        draft.action = "STORING";
        break;
      case "RESET":
        return INITIAL_STATE;
      case "SELL":
        draft.location = "TOWN";
        draft.action = "SELLING";
        break;
      case "SELL_ITEM": {
        draft.action = "IDLE";
        break;
      }
      case "SORT": {
        draft.action = "IDLE";
        break;
      }
      case "START_SORT":
        draft.action = "SORTING";
        break;
      case "STORE_HELD_ITEM": {
        draft.action = "IDLE";
        break;
      }
      case "TRASH":
        draft.action = "TRASHING";
        break;
      case "TRASH_ALL": {
        draft.action = "IDLE";
        break;
      }
      case "TRAVEL":
        draft.action = "TRAVELLING";
        draft.destination = action.payload.destination;
        break;
      default:
        return draft;
    }
  });
};
