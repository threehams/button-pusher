import { String, Record, Number, Static } from "runtypes";

export const Container = Record({
  id: String,
  name: String,
  baseWidth: Number,
  baseHeight: Number,
  maxWidth: Number,
  maxHeight: Number,
});
export type Container = Static<typeof Container>;
