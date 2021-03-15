import { Record, Static } from "runtypes";
import { DataState } from "./DataState";
import { PlayerState } from "./PlayerState";

export const State = Record({
  data: DataState,
  player: PlayerState,
});
export type State = Static<typeof State>;
