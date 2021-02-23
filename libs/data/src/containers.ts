import { Container } from "@botnet/messages";
import { v4 as uuid } from "uuid";

export const containers: Container[] = [
  {
    id: uuid(),
    height: 3,
    width: 4,
    slotIds: [],
    cost: 0,
    upgrades: [
      {
        id: uuid(),
        height: 5,
        width: 5,
        slotIds: [],
        cost: 1000,
      },
      {
        id: uuid(),
        height: 5,
        width: 6,
        slotIds: [],
        cost: 5000,
      },
      {
        id: uuid(),
        height: 6,
        width: 6,
        slotIds: [],
        cost: 50000,
      },
      {
        id: uuid(),
        height: 6,
        width: 7,
        slotIds: [],
        cost: 150000,
      },
      {
        id: uuid(),
        height: 7,
        width: 7,
        slotIds: [],
        cost: 450000,
      },
    ],
  },
];
