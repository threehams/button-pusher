import { Item } from "@botnet/messages";
import React from "react";
import { InventoryItem } from "../InventoryItem";

type HeldItemPanelProps = {
  item: Item | undefined;
};
export const HeldItemPanel = ({ item }: HeldItemPanelProps) => {
  if (!item) {
    return <div></div>;
  }
  return <InventoryItem item={item} />;
};
