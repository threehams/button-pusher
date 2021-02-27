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
  Literal("PACK"),
  Literal("AUTOMATE_PACK"),
  Literal("SORT"),
  Literal("AUTOMATE_SORT"),
  Literal("AUTOMATE_SELL"),
  Literal("APPRAISE"),
  Literal("AUTOMATE_APPRAISE"),
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
