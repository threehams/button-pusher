import { PlayerAction, PlayerLocation } from "@botnet/messages";
import { Record, Union, Static, Undefined } from "runtypes";

export const LocationState = Record({
  action: PlayerAction,
  destination: Union(PlayerLocation, Undefined),
  location: PlayerLocation,
});
export type LocationState = Static<typeof LocationState>;
