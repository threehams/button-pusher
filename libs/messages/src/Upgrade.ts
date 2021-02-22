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
  Literal("AUTOMATE_PACK"),
  Literal("AUTOMATE_SELL"),
  Literal("AUTOMATE_SORT"),
  Literal("SORT"),
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
