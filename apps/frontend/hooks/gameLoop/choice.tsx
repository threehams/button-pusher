import { alea } from "seedrandom";

const random = alea(Math.random().toString());
export const choice = <T extends unknown>(arr: T[]): T => {
  return arr[Math.floor(random() * arr.length)];
};
