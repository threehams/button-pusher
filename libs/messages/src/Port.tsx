import { Record, String, Number, Static } from "runtypes";

export const Port = Record({
  name: String,
  number: Number,
});
export type Port = Static<typeof Port>;
