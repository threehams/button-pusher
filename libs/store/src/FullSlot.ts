import { Item } from "@botnet/messages";

export type FullSlot = {
  id: string;
  x: number;
  y: number;
  item: Item;
  containerId: string;
};
