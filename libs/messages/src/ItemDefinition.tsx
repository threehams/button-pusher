import { Array, Record, String, Number, Static } from "runtypes";
import { Rarity } from "./Rarity";

export const ItemDefinition = Record({
  id: String,
  width: Number,
  height: Number,
  name: String,
  image: String,
  value: Number,
  rarities: Array(Rarity),
});
export type ItemDefinition = Static<typeof ItemDefinition>;
