import { Static, Literal, Union } from "runtypes";

export const ContainerType = Union(
  Literal("BAG"),
  Literal("EQUIP"),
  Literal("FLOOR"),
  Literal("SHOP"),
);
export type ContainerType = Static<typeof ContainerType>;
