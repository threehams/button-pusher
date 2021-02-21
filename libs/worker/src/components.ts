import type { EventsComponent } from "./features/events";
import type { LocationComponent } from "./features/location";
import type { KnownDevicesComponent, PlayerComponent } from "./features/player";
import type {
  PortscanComponent,
  StartPortscanComponent,
} from "./features/portscan";
import { StartSshSessionComponent } from "./features/ssh";
import { SshCrackComponent, StartSshCrackComponent } from "./features/sshcrack";
import type {
  StartTracerouteComponent,
  TracerouteComponent,
} from "./features/traceroute";

export type {
  LocationComponent,
  PortscanComponent,
  StartPortscanComponent,
  TracerouteComponent,
  StartTracerouteComponent,
  StartSshCrackComponent,
  StartSshSessionComponent,
  SshCrackComponent,
  EventsComponent,
  PlayerComponent,
  KnownDevicesComponent,
};

export type Component =
  | LocationComponent
  | PortscanComponent
  | StartPortscanComponent
  | TracerouteComponent
  | StartTracerouteComponent
  | StartSshCrackComponent
  | StartSshSessionComponent
  | SshCrackComponent
  | PlayerComponent
  | EventsComponent
  | KnownDevicesComponent;
