import { combineReducers } from "redux";
import { State } from "../State";
import { playersReducer } from "./playersReducer";

export const rootReducer = combineReducers<State>({
  players: playersReducer,
});
