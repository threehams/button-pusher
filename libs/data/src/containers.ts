import { Container } from "@botnet/messages";

export const availableContainers: Container[] = [
  {
    id: "HAND",
    type: "EQUIP",
    name: "Hand Slot",
    baseHeight: 1,
    baseWidth: 1,
    maxHeight: 1,
    maxWidth: 1,
  },
  {
    id: "BACKPACK",
    type: "BAG",
    name: "Backpack",
    baseHeight: 4,
    baseWidth: 4,
    maxHeight: 7,
    maxWidth: 11,
  },
  {
    id: "FLOOR",
    type: "FLOOR",
    name: "Floor",
    baseHeight: 4,
    baseWidth: 12,
    maxHeight: 4,
    maxWidth: 12,
  },
];
