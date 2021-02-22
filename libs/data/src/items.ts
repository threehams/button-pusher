import { Item } from "@botnet/messages";
import { v4 as uuid } from "uuid";

export const items: Item[] = [
  {
    id: uuid(),
    height: 1,
    width: 1,
    name: "Healing Potion",
    image: "https://www.placecage.com/50/50.png",
    value: 1,
  },
  {
    id: uuid(),
    height: 1,
    width: 1,
    name: "Mana Potion",
    image: "https://www.placecage.com/c/50/50.png",
    value: 1,
  },
  {
    id: uuid(),
    height: 1,
    width: 3,
    name: "Longsword",
    image: "https://www.placecage.com/150/50.png",
    value: 1,
  },
];
