import produce from "immer";
import { LocationState } from "../LocationState";
import { AnyAction } from "./actions";

const INITIAL_STATE: LocationState = {
  action: "IDLE" as const,
  location: "TOWN" as const,
  destination: undefined,
};

export const locationReducer = (
  state: LocationState = INITIAL_STATE,
  action: AnyAction,
): LocationState => {
  return produce(state, (draft) => {
    switch (action.type) {
      case "AUTO_DROP_JUNK":
        draft.action = "AUTO_DROPPING";
        break;
      case "AUTO_KILL":
        draft.action = "AUTO_KILLING";
        break;
      case "AUTO_SELL":
        draft.action = "AUTO_SELLING";
        break;
      case "AUTO_SORT":
        draft.action = "AUTO_SORTING";
        break;
      case "AUTO_STORE":
        draft.action = "AUTO_STORING";
        break;
      case "AUTO_TRASH":
        draft.action = "AUTO_TRASHING";
        break;
      case "AUTO_TRAVEL":
        draft.action = "AUTO_TRAVELLING";
        break;
      case "ADVENTURE":
        draft.action = "KILLING";
        break;
      case "ARRIVE":
        draft.action = "IDLE";
        if (draft.destination) {
          draft.location = draft.destination;
          draft.destination = undefined;
        }
        break;
      case "DROP_JUNK":
        draft.action = "DROPPING";
        break;
      case "PACK":
        draft.action = "STORING";
        break;
      case "SELL":
        draft.action = "SELLING";
        break;
      case "START_SORT":
        draft.action = "SORTING";
        break;
      case "TRASH":
        draft.action = "TRASHING";
        break;
      case "TRAVEL":
        draft.action = "TRAVELLING";
        draft.destination = action.payload.destination;
        break;
      case "TRASH_ALL":
      case "DROP_JUNK_ITEM":
      case "STORE_ITEM":
      case "SELL_ITEM":
      case "SORT":
      case "LOOT":
        draft.action = "IDLE";
        break;
    }
  });
};
