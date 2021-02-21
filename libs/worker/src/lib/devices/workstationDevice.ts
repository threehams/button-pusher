import { DeviceConfig } from "../../types/DeviceConfig";

export const workstationDevice: DeviceConfig = {
  type: "workstation",
  files: {
    min: 20,
    max: 40,
  },
  database: {
    min: 0,
    max: 5,
  },
  keylogging: {
    min: 70,
    max: 100,
  },
  browsing: {
    min: 40,
    max: 80,
  },
  openPorts: [22, 3389],
};
