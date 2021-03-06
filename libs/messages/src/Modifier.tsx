import { Array, Record, String, Number, Static } from "runtypes";
import { Category } from "./Category";
import { Rarity } from "./Rarity";
import { Stat } from "./Stat";

export const Modifier = Record({
  name: String,
  stat: Stat,
  multiplier: Number,
  rarities: Array(Rarity),
  categories: Array(Category),
});
export type Modifier = Static<typeof Modifier>;
