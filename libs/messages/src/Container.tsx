import { String, Record, Number, Static } from "runtypes";
import { ContainerType } from "./ContainerType";

export const Container = Record({
  id: String,
  name: String,
  baseWidth: Number,
  type: ContainerType,
  baseHeight: Number,
  maxWidth: Number,
  maxHeight: Number,
});
export type Container = Static<typeof Container>;
