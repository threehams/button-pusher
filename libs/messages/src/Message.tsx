import { Array, Union, Record, String, Literal, Static } from "runtypes";
import { Device } from "./Device";
import { Email } from "./Email";
import { PortscanProcess } from "./PortscanProcess";
import { SshCrackProcess } from "./SshCrackProcess";
import { InfostealerProcess } from "./InfostealerProcess";
import { Filesystem } from "./Filesystem";

export const TerminalMessage = Record({
  update: Literal("Terminal"),
  payload: Record({
    message: String,
  }),
});
export type TerminalMessage = Static<typeof TerminalMessage>;

export const DevicesMessage = Record({
  update: Literal("Devices"),
  payload: Record({
    devices: Array(Device),
  }),
});
export type DevicesMessage = Static<typeof DevicesMessage>;

export const PlayerMessage = Record({
  update: Literal("Player"),
  payload: Record({
    location: String,
  }),
});
export type PlayerMessage = Static<typeof PlayerMessage>;

export const EmailsMessage = Record({
  update: Literal("Emails"),
  payload: Record({
    emails: Array(Email),
  }),
});
export type EmailsMessage = Static<typeof EmailsMessage>;

export const PortscanProcessMessage = Record({
  update: Literal("PortscanProcess"),
  payload: PortscanProcess,
});
export type PortscanProcessMessage = Static<typeof PortscanProcessMessage>;

export const SshCrackProcessMessage = Record({
  update: Literal("SshCrackProcess"),
  payload: SshCrackProcess,
});
export type SshCrackProcessMessage = Static<typeof SshCrackProcessMessage>;

export const InfostealerProcessMessage = Record({
  update: Literal("InfostealerProcess"),
  payload: InfostealerProcess,
});
export type InfostealerProcessMessage = Static<
  typeof InfostealerProcessMessage
>;

export const FilesystemMessage = Record({
  update: Literal("Filesystem"),
  payload: Filesystem,
});
export type FilesystemMessage = Static<typeof FilesystemMessage>;

export const Message = Union(
  TerminalMessage,
  DevicesMessage,
  EmailsMessage,
  PlayerMessage,
  PortscanProcessMessage,
  SshCrackProcessMessage,
  InfostealerProcessMessage,
  FilesystemMessage,
);
export type Message = Static<typeof Message>;
