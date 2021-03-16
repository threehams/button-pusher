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
      case "AUTO_DROP_JUNK":
        if (draft.action === "IDLE") {
          draft.action = "AUTO_DROPPING";
        }
        break;
      case "AUTO_KILL":
        if (draft.action === "IDLE") {
          draft.action = "AUTO_KILLING";
        }
        break;
      case "AUTO_SELL":
        if (draft.action === "IDLE") {
          draft.action = "AUTO_SELLING";
        }
        break;
      case "AUTO_SORT":
        if (draft.action === "IDLE") {
          draft.action = "AUTO_SORTING";
        }
        break;
      case "AUTO_STORE":
        if (draft.action === "IDLE") {
          draft.action = "AUTO_STORING";
        }
        break;
      case "AUTO_TRASH":
        if (draft.action === "IDLE") {
          draft.action = "AUTO_TRASHING";
        }
        break;
      case "AUTO_TRAVEL":
        if (draft.action === "IDLE") {
          draft.action = "AUTO_TRAVELLING";
        }
        break;
      case "ADVENTURE":
        if (draft.action === "IDLE" || draft.action === "AUTO_KILLING") {
          draft.action = "KILLING";
        }
        break;
      case "ARRIVE":
        draft.action = "IDLE";
        if (draft.destination) {
          draft.location = draft.destination;
          draft.destination = undefined;
        }
        break;
      case "DROP_JUNK":
        if (draft.action === "IDLE" || draft.action === "AUTO_DROPPING") {
          draft.action = "DROPPING";
        }
        break;
      case "PACK":
        if (draft.action === "IDLE" || draft.action === "AUTO_STORING") {
          draft.action = "STORING";
        }
        break;
      case "RESET":
        return INITIAL_STATE;
      case "SELL":
        if (
          draft.location === "TOWN" &&
          (draft.action === "IDLE" || draft.action === "AUTO_SELLING")
        ) {
          draft.action = "SELLING";
        }
        break;
      case "START_SORT":
        if (draft.action === "IDLE" || draft.action === "AUTO_SORTING") {
          draft.action = "SORTING";
        }
        break;
      case "TRASH":
        if (draft.action === "IDLE" || draft.action === "AUTO_TRASHING") {
          draft.action = "TRASHING";
        }
        break;
      case "TRAVEL":
        draft.action = "TRAVELLING";
        draft.destination = action.payload.destination;
        break;
      case "TRASH_ALL":
      case "DROP_JUNK_ITEM":
      case "STORE_HELD_ITEM":
      case "SELL_ITEM":
      case "SORT":
      case "LOOT":
        draft.action = "IDLE";
        break;
    }
  });
};
