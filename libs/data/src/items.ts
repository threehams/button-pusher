import { ItemDefinition } from "@botnet/messages";

export const items: ItemDefinition[] = [
  {
    id: "HEALING_POTION",
    height: 1,
    width: 1,
    name: "Healing Potion",
    image: "assets/potion.svg",
    value: 10,
    category: "POTION",
  },
  {
    id: "BOMB",
    height: 1,
    width: 1,
    name: "A Bomb",
    image: "assets/bomb.svg",
    value: 10,
    category: "THROWABLE",
  },
  {
    id: "GEM",
    height: 1,
    width: 1,
    name: "Gem",
    image: "assets/gem.svg",
    value: 50,
    category: "CRAFTING",
  },
  {
    id: "DAGGER",
    height: 2,
    width: 1,
    name: "Dagger",
    image: "assets/dagger.svg",
    value: 30,
    category: "MELEE",
  },
  {
    id: "BUCKLER",
    height: 2,
    width: 2,
    name: "Buckler",
    image: "assets/buckler.svg",
    value: 80,
    category: "SHIELD",
  },
  {
    id: "HELM",
    height: 2,
    width: 2,
    name: "Helm",
    image: "assets/helm.svg",
    value: 80,
    category: "ARMOR",
  },
  {
    id: "LONGSWORD",
    height: 3,
    width: 1,
    name: "Longsword",
    image: "assets/longsword.svg",
    value: 100,
    category: "MELEE",
  },
  {
    id: "2HAND_SWORD",
    height: 4,
    width: 1,
    name: "Two Handed Sword",
    image: "assets/2hsword.svg",
    value: 100,
    category: "MELEE",
  },
  {
    id: "SPEAR",
    height: 4,
    width: 1,
    name: "Spear",
    image: "assets/spear.svg",
    value: 100,
    category: "MELEE",
  },
  {
    id: "PANTS",
    height: 3,
    width: 2,
    name: "Pants",
    image: "assets/pants.svg",
    value: 100,
    category: "ARMOR",
  },
  {
    id: "MAIL",
    height: 3,
    width: 2,
    name: "Mail",
    image: "assets/mail.svg",
    value: 100,
    category: "ARMOR",
  },
  {
    id: "SCYTHE",
    height: 4,
    width: 2,
    name: "Scythe",
    image: "assets/scythe.svg",
    value: 400,
    category: "MELEE",
  },
  {
    id: "BOW",
    height: 4,
    width: 2,
    name: "Bow",
    image: "assets/bow.svg",
    value: 400,
    category: "BOW",
  },
];
