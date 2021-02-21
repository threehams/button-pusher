import { Record, String, Static } from "runtypes";

export const Resources = Record({
  bitcoin: String,
});
export type Resources = Static<typeof Resources>;
