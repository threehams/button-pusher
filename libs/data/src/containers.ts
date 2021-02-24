import { Container } from "@botnet/messages";
import { v4 as uuid } from "uuid";

export const containers: Container[] = [
  {
    id: uuid(),
    name: "Backpack",
    levels: [
      {
        level: 1,
        height: 3,
        width: 3,
        cost: 0,
      },
      {
        level: 2,
        height: 4,
        width: 4,
        cost: 1000,
      },
      {
        level: 3,
        height: 5,
        width: 6,
        cost: 2000,
      },
      {
        level: 4,
        height: 6,
        width: 6,
        cost: 4000,
      },
      {
        level: 5,
        height: 6,
        width: 7,
        cost: 8000,
      },
      {
        level: 6,
        height: 7,
        width: 7,
        cost: 450000,
      },
    ],
  },
];
