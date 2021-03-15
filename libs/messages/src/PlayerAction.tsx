import { Union, Literal, Static } from "runtypes";

export const PlayerAction = Union(
  Literal("KILLING"),
  Literal("TRAVELLING"),
  Literal("SELLING"),
  Literal("IDLE"),
  Literal("STORING"),
  Literal("DROPPING"),
  Literal("TRASHING"),
  Literal("SORTING"),
  Literal("AUTO_KILLING"),
  Literal("AUTO_TRAVELLING"),
  Literal("AUTO_SELLING"),
  Literal("AUTO_IDLE"),
  Literal("AUTO_STORING"),
  Literal("AUTO_DROPPING"),
  Literal("AUTO_TRASHING"),
  Literal("AUTO_SORTING"),
);
export type PlayerAction = Static<typeof PlayerAction>;
