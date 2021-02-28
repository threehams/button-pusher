import { Union, Literal, Static } from "runtypes";

export const PlayerAction = Union(
  Literal("KILLING"),
  Literal("TRAVELLING"),
  Literal("SELLING"),
  Literal("IDLE"),
  Literal("STORING"),
);
export type PlayerAction = Static<typeof PlayerAction>;
