import { Item } from "@botnet/messages";
import React from "react";

type HeldItemPanelProps = {
  item: Item | undefined;
};
export const HeldItemPanel = ({ item }: HeldItemPanelProps) => {
  if (!item) {
    return <div></div>;
  }
  return <div>{item.name}</div>;
};
