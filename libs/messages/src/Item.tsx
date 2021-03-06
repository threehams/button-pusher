import { Record, String, Number, Static, Array } from "runtypes";
import { Modifier } from "./Modifier";
import { Rarity } from "./Rarity";

export const Item = Record({
  id: String,
  width: Number,
  height: Number,
  name: String,
  image: String,
  value: Number,
  rarity: Rarity,
  modifiers: Array(Modifier),
});
export type Item = Static<typeof Item>;
