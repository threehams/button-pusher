import {
  Device,
  Email,
  Filesystem,
  Resources,
  Process,
} from "@botnet/messages";
import {
  Static,
  Record,
  String,
  Null,
  Union,
  Array,
  Dictionary,
} from "runtypes";

export const State = Record({
  messages: Array(String),
  devices: Array(Device),
  resources: Union(Resources, Null),
  commandHistory: Array(String),
  processes: Array(Process),
  emails: Array(Email),
  filesystems: Dictionary(Filesystem),
  location: String,
  cwd: String,
});
export type State = Static<typeof State>;
