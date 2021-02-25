import { Item } from "@botnet/messages";
import { AddSlot, MoveSlot } from "@botnet/store";
import React from "react";
import { InventoryItem } from "../InventoryItem";

type HeldItemPanelProps = {
  item: Item | undefined;
  addSlot: AddSlot;
  moveSlot: MoveSlot;
};
export const HeldItemPanel = ({
  addSlot,
  moveSlot,
  item,
}: HeldItemPanelProps) => {
  if (!item) {
    return <div></div>;
  }
  return <InventoryItem moveSlot={moveSlot} addSlot={addSlot} item={item} />;
};
