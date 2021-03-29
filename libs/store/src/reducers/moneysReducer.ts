import produce from "immer";
import { MoneysState } from "../MoneysState";
import { AnyAction } from "./actions";

const getInitialState = (): MoneysState => {
  return {
    moneys: 0,
    highestMoneys: 0,
  };
};

export const moneysReducer = (
  state: MoneysState = getInitialState(),
  action: AnyAction,
): MoneysState => {
  return produce(state, (draft) => {
    switch (action.type) {
      case "ADD_CONTAINER":
      case "UPGRADE_CONTAINER":
      case "BUY_UPGRADE":
        draft.moneys -= action.payload.cost;
        break;
    }
  });
};
