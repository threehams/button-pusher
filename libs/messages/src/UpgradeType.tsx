import { Union, Literal, Static } from "runtypes";

export const UpgradeType = Union(
  Literal("APPRAISE"),
  Literal("AUTOMATE_APPRAISE"),
  Literal("PACK"),
  Literal("AUTOMATE_PACK"),
  Literal("SELL"),
  Literal("AUTOMATE_SELL"),
  Literal("SORT"),
  Literal("AUTOMATE_SORT"),
  Literal("TRAVEL"),
  Literal("AUTOMATE_TRAVEL"),
  Literal("KILL"),
  Literal("AUTOMATE_KILL"),
  Literal("DROP_JUNK"),
  Literal("AUTOMATE_DROP_JUNK"),
  Literal("TRASH"),
  Literal("AUTOMATE_TRASH"),
);
export type UpgradeType = Static<typeof UpgradeType>;
