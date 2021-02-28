import {
  Array,
  Record,
  Union,
  Literal,
  String,
  Number,
  Static,
} from "runtypes";

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
);
export type UpgradeType = Static<typeof UpgradeType>;

export const Upgrade = Record({
  id: UpgradeType,
  name: String,
  levels: Array(
    Record({
      cost: Number,
      level: Number,
    }),
  ),
});
export type Upgrade = Static<typeof Upgrade>;
