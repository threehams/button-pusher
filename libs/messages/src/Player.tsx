import { PlayerLocation, PlayerAction } from "@botnet/messages";
import { Record, Static, Undefined, Union } from "runtypes";

export const Player = Record({
  action: PlayerAction,
  destination: Union(PlayerLocation, Undefined),
  location: PlayerLocation,
});
export type Player = Static<typeof Player>;
