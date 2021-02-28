import { UpgradeMap } from "@botnet/messages";

export const upgrades: UpgradeMap = {
  KILL: {
    name: "Kill things faster",
    baseCost: 100,
    maxLevel: undefined,
  },
  SELL: {
    name: "Sell stuff faster",
    baseCost: 500,
    maxLevel: undefined,
  },
  AUTOMATE_KILL: {
    name: "Kill things automatically",
    baseCost: 1000,
    maxLevel: undefined,
  },
  PACK: {
    name: "Store stuff in inventory",
    baseCost: 2000,
    maxLevel: undefined,
  },
  SORT: {
    name: "Sort inventory",
    baseCost: 5000,
    maxLevel: undefined,
  },
  TRAVEL: {
    name: "Travel faster",
    baseCost: 5000,
    maxLevel: undefined,
  },
  AUTOMATE_PACK: {
    name: "Autopack inventory",
    baseCost: 10000,
    maxLevel: undefined,
  },
  AUTOMATE_TRAVEL: {
    name: "Auto travel",
    baseCost: 20000,
    maxLevel: undefined,
  },
  AUTOMATE_SORT: {
    name: "Autosort inventory",
    baseCost: 100,
    maxLevel: undefined,
  },
  AUTOMATE_SELL: {
    name: "Autosell when inventory is full",
    baseCost: 100,
    maxLevel: undefined,
  },
  APPRAISE: {
    name: "Appraise inventory value",
    baseCost: 100,
    maxLevel: undefined,
  },
  AUTOMATE_APPRAISE: {
    name: "Automatically appraise inventory value",
    baseCost: 100,
    maxLevel: undefined,
  },
};
