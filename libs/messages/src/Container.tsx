import { Array, String, Record, Number, Static } from "runtypes";

export const ContainerLevel = Record({
  level: Number,
  cost: Number,
  width: Number,
  height: Number,
});
export type ContainerLevel = Static<typeof ContainerLevel>;

export const Container = Record({
  id: String,
  name: String,
  levels: Array(ContainerLevel),
});
export type Container = Static<typeof Container>;
