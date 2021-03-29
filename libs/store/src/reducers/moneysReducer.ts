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
      case "BUY_CONTAINER":
      case "BUY_CONTAINER_UPGRADE":
      case "BUY_UPGRADE":
        draft.moneys -= action.payload.cost;
        break;
    }
  });
};
