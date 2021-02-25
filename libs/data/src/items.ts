import { Item } from "@botnet/messages";
import { v4 as uuid } from "uuid";

export const items: Item[] = [
  {
    id: uuid(),
    height: 1,
    width: 1,
    name: "Healing Potion",
    image: "https://www.placecage.com/50/50.png",
    value: 10,
  },
  {
    id: uuid(),
    height: 1,
    width: 1,
    name: "Mana Potion",
    image: "https://www.placecage.com/c/50/50.png",
    value: 15,
  },
  {
    id: uuid(),
    height: 2,
    width: 1,
    name: "Book",
    image: "https://www.placecage.com/c/50/100.png",
    value: 15,
  },
  {
    id: uuid(),
    height: 3,
    width: 1,
    name: "Longsword",
    image: "https://www.placecage.com/50/150.png",
    value: 100,
  },
  {
    id: uuid(),
    height: 4,
    width: 1,
    name: "Two Handed Sword",
    image: "https://www.placecage.com/50/200.png",
    value: 100,
  },
  {
    id: uuid(),
    height: 3,
    width: 2,
    name: "Pants",
    image: "https://www.placecage.com/100/150.png",
    value: 400,
  },
  {
    id: uuid(),
    height: 3,
    width: 2,
    name: "Shirt",
    image: "https://www.placecage.com/c/100/150.png",
    value: 400,
  },
  {
    id: uuid(),
    height: 4,
    width: 2,
    name: "Halberd",
    image: "https://www.placecage.com/c/100/200.png",
    value: 400,
  },
];
