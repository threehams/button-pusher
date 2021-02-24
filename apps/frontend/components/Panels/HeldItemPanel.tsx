import { Item } from "@botnet/messages";
import { AddSlot } from "@botnet/store";
import React from "react";
import { InventoryItem } from "../InventoryItem";

type HeldItemPanelProps = {
  item: Item | undefined;
  addSlot: AddSlot;
};
export const HeldItemPanel = ({ addSlot, item }: HeldItemPanelProps) => {
  if (!item) {
    return <div></div>;
  }
  return <InventoryItem addSlot={addSlot} item={item} />;
};
