import { Record, Union, String, Number, Static, Undefined } from "runtypes";

export const Upgrade = Record({
  name: String,
  upgradeName: String,
  baseCost: Number,
  // costScaling: Number,
  // softCap: Number,
  maxLevel: Union(Number, Undefined),
});
export type Upgrade = Static<typeof Upgrade>;
