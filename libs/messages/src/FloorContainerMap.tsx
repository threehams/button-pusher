import { Record, Static, String } from "runtypes";

export const FloorContainerMap = Record({
  TOWN: String,
  KILLING_FIELDS: String,
});
export type FloorContainerMap = Static<typeof FloorContainerMap>;
