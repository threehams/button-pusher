import {
  Boolean,
  Literal,
  Null,
  Number,
  Record,
  Static,
  String,
  Union,
} from "runtypes";

export const SshCrackProcess = Record({
  id: String,
  command: Literal("sshcrack"),
  origin: String,
  target: String,
  progress: Number,
  complete: Boolean,
  error: Union(String, Null),
});
export type SshCrackProcess = Static<typeof SshCrackProcess>;
