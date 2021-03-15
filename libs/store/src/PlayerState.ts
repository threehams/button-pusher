import { PlayerLocation, PlayerAction } from "@botnet/messages";
import { Record, Static, Undefined, Union } from "runtypes";

export const PlayerState = Record({
  playerAction: PlayerAction,
  playerDestination: Union(PlayerLocation, Undefined),
  playerLocation: PlayerLocation,
});
export type PlayerState = Static<typeof PlayerState>;
