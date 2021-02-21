import { Record, String, Array, Static } from "runtypes";

export const Device = Record({
  ip: String,
  commands: Array(String),
});
export type Device = Static<typeof Device>;
