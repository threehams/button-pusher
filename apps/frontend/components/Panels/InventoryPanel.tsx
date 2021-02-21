import { Inventory } from "@botnet/store";
import React from "react";

type InventoryPanelProps = {
  inventory: Inventory | undefined;
};
export const InventoryPanel = ({ inventory }: InventoryPanelProps) => {
  if (!inventory) {
    return <div></div>;
  }
  return (
    <div>
      height: {inventory.height}
      width: {inventory.width}
      items:{" "}
      {inventory.slots.map((slot) => {
        return <div key={slot.id}>{slot.item.name}</div>;
      })}
    </div>
  );
};
