import { SkillsState } from "./SkillsState";
import { String, Record, Static } from "runtypes";
import { InventoryState } from "./InventoryState";
import { LocationState } from "./LocationState";

export const PlayerState = Record({
  id: String,
  name: String,
  inventory: InventoryState,
  location: LocationState,
  skills: SkillsState,
});
export type PlayerState = Static<typeof PlayerState>;
