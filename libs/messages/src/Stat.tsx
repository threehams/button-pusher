import { Static, Union, Literal } from "runtypes";

export const Stat = Union(
  Literal("DAMAGE"),
  Literal("DEFENSE"),
  Literal("HEALTH"),
  Literal("BLOCK"),
  Literal("HEALING"),
  Literal("FIRE_DAMAGE"),
  Literal("ICE_DAMAGE"),
);
export type State = Static<typeof Stat>;
