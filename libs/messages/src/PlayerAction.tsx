import { Union, Literal, Static } from "runtypes";

export const PlayerAction = Union(
  Literal("KILLING"),
  Literal("TRAVELLING"),
  Literal("SELLING"),
  Literal("IDLE"),
  Literal("STORING"),
  Literal("DROPPING"),
);
export type PlayerAction = Static<typeof PlayerAction>;
