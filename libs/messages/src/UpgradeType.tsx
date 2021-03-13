import { Union, Literal, Static } from "runtypes";

export const UpgradeType = Union(
  Literal("pack"),
  Literal("autoPack"),
  Literal("sell"),
  Literal("autoSell"),
  Literal("sort"),
  Literal("autoSort"),
  Literal("travel"),
  Literal("autoTravel"),
  Literal("kill"),
  Literal("autoKill"),
  Literal("dropJunk"),
  Literal("autoDropJunk"),
  Literal("trash"),
  Literal("autoTrash"),
);
export type UpgradeType = Static<typeof UpgradeType>;
