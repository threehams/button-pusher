import { combineReducers } from "redux";
import { State } from "../State";
import { dataReducer } from "./dataReducer";
import { playerReducer } from "./playerReducer";

export const rootReducer = combineReducers<State>({
  data: dataReducer,
  player: playerReducer,
});
