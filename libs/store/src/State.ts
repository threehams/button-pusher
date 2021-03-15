import { Record, Static } from "runtypes";
import { DataState } from "./DataState";

export const State = Record({
  data: DataState,
});
export type State = Static<typeof State>;
