import { ContainerType, Item } from "@botnet/messages";

export type Inventory = {
  id: string;
  width: number;
  height: number;
  slots: {
    id: string;
    x: number;
    y: number;
    item: Item;
  }[];
  grid: (string | false)[][];
  full: boolean;
  cost: number;
  nextAvailable: number;
  sorted: boolean;
  type: ContainerType;
  junk: boolean;
  allJunk: boolean;
};
