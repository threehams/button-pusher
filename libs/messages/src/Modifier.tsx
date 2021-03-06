import { Array, Record, String, Number, Static } from "runtypes";
import { Category } from "./Category";
import { ModifierType } from "./ModifierType";
import { Rarity } from "./Rarity";
import { Stat } from "./Stat";

export const Modifier = Record({
  name: String,
  stat: Stat,
  multiplier: Number,
  type: ModifierType,
  rarities: Array(Rarity),
  categories: Array(Category),
});
export type Modifier = Static<typeof Modifier>;
