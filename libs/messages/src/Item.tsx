import { Record, String, Number, Static } from "runtypes";
import { Rarity } from "./Rarity";

export const Item = Record({
  id: String,
  width: Number,
  height: Number,
  name: String,
  image: String,
  value: Number,
  rarity: Rarity,
});
export type Item = Static<typeof Item>;
