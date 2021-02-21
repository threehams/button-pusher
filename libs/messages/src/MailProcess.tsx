import { Record, String, Literal, Static, Boolean } from "runtypes";

export const MailProcess = Record({
  id: String,
  command: Literal("mail"),
  complete: Boolean,
});
export type MailProcess = Static<typeof MailProcess>;
