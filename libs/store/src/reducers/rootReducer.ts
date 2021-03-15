import { combineReducers } from "redux";
import { State } from "../State";
import { dataReducer } from "./dataReducer";

export const rootReducer = combineReducers<State>({
  data: dataReducer,
});
