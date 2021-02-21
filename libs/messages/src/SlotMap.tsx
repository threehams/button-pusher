import { Static, Dictionary } from "runtypes";
import { Slot } from "./Slot";

export const SlotMap = Dictionary(Slot);
export type SlotMap = Static<typeof SlotMap>;
