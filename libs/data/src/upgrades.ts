import { Upgrade } from "@botnet/messages";

export const upgrades: Upgrade[] = [
  {
    name: "Build an auto-packer",
    id: "AUTOMATE_PACK",
    levels: [
      {
        level: 1,
        cost: 1,
      },
      {
        level: 2,
        cost: 5000,
      },
      {
        level: 3,
        cost: 10000,
      },
    ],
  },
  {
    name: "Sort inventory",
    id: "SORT",
    levels: [
      {
        level: 1,
        cost: 5000,
      },
      {
        level: 2,
        cost: 15000,
      },
      {
        level: 3,
        cost: 30000,
      },
    ],
  },
  {
    name: "Autosort inventory",
    id: "AUTOMATE_SORT",
    levels: [
      {
        level: 1,
        cost: 5000,
      },
      {
        level: 2,
        cost: 15000,
      },
      {
        level: 3,
        cost: 30000,
      },
    ],
  },
  {
    name: "Autosell when inventory is full",
    id: "AUTOMATE_SELL",
    levels: [
      {
        level: 1,
        cost: 5000,
      },
      {
        level: 2,
        cost: 15000,
      },
      {
        level: 3,
        cost: 30000,
      },
    ],
  },
];
