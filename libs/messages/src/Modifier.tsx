import {
  Array,
  Record,
  String,
  Number,
  Static,
  Union,
  Literal,
} from "runtypes";
import { Category } from "./Category";
import { Rarity } from "./Rarity";

export const Stat = Union(
  Literal("DAMAGE"),
  Literal("DEFENSE"),
  Literal("BLOCK"),
  Literal("HEALING"),
  Literal("FIRE_DAMAGE"),
  Literal("ICE_DAMAGE"),
);

export const Modifier = Record({
  name: String,
  stat: Stat,
  multiplier: Number,
  rarities: Array(Rarity),
  categories: Array(Category),
});
export type Modifier = Static<typeof Modifier>;
