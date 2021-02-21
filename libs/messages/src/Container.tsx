import { Array, String, Record, Number, Static } from "runtypes";

export const Container = Record({
  id: String,
  width: Number,
  height: Number,
  slotIds: Array(String),
});
export type Container = Static<typeof Container>;
