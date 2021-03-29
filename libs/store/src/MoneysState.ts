import { Record, Static, Number } from "runtypes";

export const MoneysState = Record({
  moneys: Number,
  highestMoneys: Number,
});
export type MoneysState = Static<typeof MoneysState>;
