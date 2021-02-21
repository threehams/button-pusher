import {
  Array,
  Boolean,
  Literal,
  Null,
  Number,
  Record,
  Static,
  String,
  Union,
} from "runtypes";
import { Port } from "./Port";

export const PortscanProcess = Record({
  id: String,
  command: Literal("portscan"),
  origin: String,
  target: String,
  progress: Number,
  complete: Boolean,
  error: Union(String, Null),
  ports: Array(Port),
});
export type PortscanProcess = Static<typeof PortscanProcess>;
