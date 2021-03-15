import { UpgradeMap } from "@botnet/messages";

export const upgrades: UpgradeMap = {
  kill: {
    name: "Kill things faster",
    upgradeName: "Kill things faster",
    baseCost: 100,
    maxLevel: undefined,
  },
  sell: {
    name: "Sell stuff faster",
    upgradeName: "Sell stuff faster",
    baseCost: 500,
    maxLevel: undefined,
  },
  autoKill: {
    name: "Kill things automatically",
    upgradeName: "Auto kill faster",
    baseCost: 1200,
    maxLevel: undefined,
  },
  pack: {
    name: "Store stuff in inventory",
    upgradeName: "Store things faster",
    baseCost: 1000,
    maxLevel: undefined,
  },
  sort: {
    name: "Sort inventory",
    upgradeName: "Sort inventory",
    baseCost: 3500,
    maxLevel: 1,
  },
  travel: {
    name: "Travel faster",
    upgradeName: "Travel faster",
    baseCost: 4000,
    maxLevel: undefined,
  },
  autoPack: {
    name: "Auto store in inventory",
    upgradeName: "Auto store faster",
    baseCost: 6000,
    maxLevel: undefined,
  },
  autoTravel: {
    name: "Auto travel to/from town",
    upgradeName: "Auto travel with less delay",
    baseCost: 30000,
    maxLevel: undefined,
  },
  autoSort: {
    name: "Auto sort inventory",
    upgradeName: "Auto sort faster",
    baseCost: 10000,
    maxLevel: undefined,
  },
  autoSell: {
    name: "Auto sell while in town",
    upgradeName: "Auto sell faster",
    baseCost: 20000,
    maxLevel: undefined,
  },
  dropJunk: {
    name: "Drop inventory junk onto floor",
    upgradeName: "Drop junk faster",
    baseCost: 100,
    maxLevel: undefined,
  },
  autoDropJunk: {
    name: "Drop junk automatically",
    upgradeName: "Auto drop faster",
    baseCost: 100,
    maxLevel: undefined,
  },
  trash: {
    name: "Leave items on floor behind",
    upgradeName: "Leave items faster",
    baseCost: 100,
    maxLevel: undefined,
  },
  autoTrash: {
    name: "Auto leave behind floor",
    upgradeName: "Auto leave faster",
    baseCost: 100,
    maxLevel: undefined,
  },
};
