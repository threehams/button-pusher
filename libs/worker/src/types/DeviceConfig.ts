export type DeviceType = "workstation";

type Weights = {
  min: number;
  max: number;
};

// all numbers are weights from 1-100
export type DeviceConfig = {
  type: DeviceType;
  files: Weights;
  database: Weights;
  keylogging: Weights;
  browsing: Weights;
  openPorts: number[];
};
