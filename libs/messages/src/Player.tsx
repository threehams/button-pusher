import { String, Record, Static, Undefined, Union } from "runtypes";
import { PlayerAction } from "./PlayerAction";
import { PlayerLocation } from "./PlayerLocation";

export const Player = Record({
  id: String,
  action: PlayerAction,
  destination: Union(PlayerLocation, Undefined),
  location: PlayerLocation,
});
export type Player = Static<typeof Player>;
