import { Union, Literal, Static } from "runtypes";

export const Category = Union(
  Literal("CONSUMABLE"),
  Literal("MELEE"),
  Literal("BOW"),
  Literal("ARMOR"),
  Literal("SHIELD"),
  Literal("CRAFTING"),
);
export type Category = Static<typeof Category>;
