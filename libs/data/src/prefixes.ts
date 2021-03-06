import { Modifier } from "@botnet/messages";

export const prefixes: Modifier[] = [
  {
    name: "Broken",
    stat: "DAMAGE",
    multiplier: 0.2,
    rarities: ["JUNK"],
    categories: ["MELEE", "ARMOR"],
  },
  {
    name: "Trashed",
    stat: "DAMAGE",
    multiplier: 0.3,
    rarities: ["JUNK"],
    categories: ["MELEE", "ARMOR"],
  },
  {
    name: "Junky",
    stat: "DAMAGE",
    multiplier: 0.4,
    rarities: ["JUNK"],
    categories: ["MELEE", "ARMOR"],
  },
  {
    name: "Total Butts",
    stat: "DAMAGE",
    multiplier: 0.6,
    rarities: ["JUNK"],
    categories: ["MELEE", "ARMOR"],
  },
  {
    name: "Janky",
    stat: "DAMAGE",
    multiplier: 0.8,
    rarities: ["JUNK"],
    categories: ["MELEE", "ARMOR"],
  },
  {
    name: "Big",
    stat: "DAMAGE",
    multiplier: 1.5,
    rarities: ["UNCOMMON", "RARE", "EPIC", "LEGENDARY"],
    categories: ["MELEE"],
  },
  {
    name: "Huge",
    stat: "DAMAGE",
    multiplier: 2,
    rarities: ["UNCOMMON", "RARE", "EPIC", "LEGENDARY"],
    categories: ["MELEE"],
  },
  {
    name: "Massive",
    stat: "DAMAGE",
    multiplier: 3,
    rarities: ["UNCOMMON", "RARE", "EPIC", "LEGENDARY"],
    categories: ["MELEE"],
  },
  {
    name: "Gigantic",
    stat: "DAMAGE",
    multiplier: 4,
    rarities: ["UNCOMMON", "RARE", "EPIC", "LEGENDARY"],
    categories: ["MELEE"],
  },
  {
    name: "Enormous",
    stat: "DAMAGE",
    multiplier: 5,
    rarities: ["UNCOMMON", "RARE", "EPIC", "LEGENDARY"],
    categories: ["MELEE"],
  },
];
