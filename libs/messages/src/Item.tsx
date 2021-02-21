import { Record, String, Number, Static } from "runtypes";

export const Item = Record({
  id: String,
  width: Number,
  height: Number,
  name: String,
  image: String,
  value: Number,
});
export type Item = Static<typeof Item>;
