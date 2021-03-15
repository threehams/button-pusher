import { Player } from "@botnet/messages";
import { Static } from "runtypes";

export const PlayerState = Player;
export type PlayerState = Static<typeof PlayerState>;
