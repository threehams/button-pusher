import { Container } from "@botnet/messages";
import { v4 as uuid } from "uuid";

export const containers: Container[] = [
  {
    id: uuid(),
    name: "Backpack",
    baseHeight: 4,
    baseWidth: 4,
    maxHeight: 7,
    maxWidth: 11,
  },
];
