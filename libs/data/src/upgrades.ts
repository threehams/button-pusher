import { UpgradeMap } from "@botnet/messages";

export const upgrades: UpgradeMap = {
  KILL: {
    name: "Kill things faster",
    upgradeName: "Kill things faster",
    baseCost: 100,
    maxLevel: undefined,
  },
  SELL: {
    name: "Sell stuff faster",
    upgradeName: "Sell stuff faster",
    baseCost: 500,
    maxLevel: undefined,
  },
  AUTOMATE_KILL: {
    name: "Kill things automatically",
    upgradeName: "Auto kill faster",
    baseCost: 1200,
    maxLevel: undefined,
  },
  PACK: {
    name: "Store stuff in inventory",
    upgradeName: "Store things faster",
    baseCost: 1000,
    maxLevel: undefined,
  },
  SORT: {
    name: "Sort inventory",
    upgradeName: "Sort inventory",
    baseCost: 5000,
    maxLevel: 1,
  },
  TRAVEL: {
    name: "Travel faster",
    upgradeName: "Travel faster",
    baseCost: 5000,
    maxLevel: undefined,
  },
  AUTOMATE_PACK: {
    name: "Auto store in inventory",
    upgradeName: "Auto store faster",
    baseCost: 10000,
    maxLevel: undefined,
  },
  AUTOMATE_TRAVEL: {
    name: "Auto travel to/from town",
    upgradeName: "Auto travel with less delay",
    baseCost: 50000,
    maxLevel: undefined,
  },
  AUTOMATE_SORT: {
    name: "Auto sort inventory",
    upgradeName: "Auto sort faster",
    baseCost: 35000,
    maxLevel: undefined,
  },
  AUTOMATE_SELL: {
    name: "Auto sell while in town",
    upgradeName: "Auto sell faster",
    baseCost: 20000,
    maxLevel: undefined,
  },
  APPRAISE: {
    name: "Appraise inventory value",
    upgradeName: "",
    baseCost: 100,
    maxLevel: undefined,
  },
  AUTOMATE_APPRAISE: {
    name: "Automatically appraise inventory value",
    upgradeName: "",
    baseCost: 100,
    maxLevel: undefined,
  },
};
