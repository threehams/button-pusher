import { Static, Literal, Union } from "runtypes";

export const ContainerType = Union(
  Literal("BAG"),
  Literal("EQUIP"),
  Literal("FLOOR"),
);
export type ContainerType = Static<typeof ContainerType>;
