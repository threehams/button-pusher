import {
  Array,
  Boolean,
  Literal,
  Null,
  Record,
  Static,
  String,
  Union,
} from "runtypes";
import { Login } from "./Login";

export const InfostealerProcess = Record({
  id: String,
  command: Literal("infostealer"),
  target: String,
  complete: Boolean,
  error: Union(String, Null),
  logins: Array(Login),
});
export type InfostealerProcess = Static<typeof InfostealerProcess>;
