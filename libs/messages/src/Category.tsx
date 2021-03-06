import { Union, Literal, Static } from "runtypes";

export const Category = Union(
  Literal("FOOD"),
  Literal("POTION"),
  Literal("MELEE"),
  Literal("BOW"),
  Literal("ARMOR"),
  Literal("SHIELD"),
  Literal("CRAFTING"),
  Literal("THROWABLE"),
);
export type Category = Static<typeof Category>;
