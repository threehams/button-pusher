import { PortscanProcess } from "./PortscanProcess";
import { MailProcess } from "./MailProcess";
import { SshCrackProcess } from "./SshCrackProcess";
import { InfostealerProcess } from "./InfostealerProcess";
import { Union, Static } from "runtypes";

export const Process = Union(
  PortscanProcess,
  MailProcess,
  SshCrackProcess,
  InfostealerProcess,
);
export type Process = Static<typeof Process>;
