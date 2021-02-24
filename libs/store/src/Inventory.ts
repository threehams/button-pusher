import { ContainerLevel, Item } from "@botnet/messages";

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
  nextUpgrade: ContainerLevel;
};
