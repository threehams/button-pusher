import { Item } from "@botnet/messages";
import { v4 as uuid } from "uuid";

export const items: Item[] = [
  {
    id: uuid(),
    height: 1,
    width: 1,
    name: "Healing Potion",
    image: "https://placecage/50/50.png",
    value: 1,
  },
  {
    id: uuid(),
    height: 1,
    width: 1,
    name: "Mana Potion",
    image: "https://placecage/50/50.png",
    value: 1,
  },
  {
    id: uuid(),
    height: 1,
    width: 5,
    name: "Longsword",
    image: "https://placecage/250/50.png",
    value: 1,
  },
];
