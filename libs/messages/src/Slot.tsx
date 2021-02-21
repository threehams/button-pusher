import { Record, String, Number, Static } from "runtypes";

export const Slot = Record({
  id: String,
  x: Number,
  y: Number,
  itemId: String,
  containerId: String,
});
export type Slot = Static<typeof Slot>;
