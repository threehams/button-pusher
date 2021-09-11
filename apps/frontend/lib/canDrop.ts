export type CanDrop = (opts: { x: number; y: number; containerId: string }) => {
  valid: boolean;
  required: boolean;
};
