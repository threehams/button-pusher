export type KnownDevicesComponent = {
  type: "KnownDevices";
  items: KnownDevice[];
};
type KnownDevice = {
  ip: string;
  ports: number[];
  password?: string;
};
