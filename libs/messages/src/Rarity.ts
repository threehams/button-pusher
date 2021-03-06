import { Union, Literal, Static } from "runtypes";

export const Rarity = Union(
  Literal("JUNK"),
  Literal("COMMON"),
  Literal("UNCOMMON"),
  Literal("RARE"),
  Literal("EPIC"),
  Literal("LEGENDARY"),
);
export type Rarity = Static<typeof Rarity>;
