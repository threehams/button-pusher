import { AddSlot, Inventory, MoveSlot } from "@botnet/store";
import React from "react";
import { range } from "lodash";
import { css, useTheme } from "@emotion/react";
import { InventorySlot } from "../InventorySlot";

type InventoryPanelProps = {
  inventory: Inventory | undefined;
  addSlot: AddSlot;
  moveSlot: MoveSlot;
};
export const InventoryPanel = ({
  inventory,
  addSlot,
  moveSlot,
}: InventoryPanelProps) => {
  const theme = useTheme();

  if (!inventory) {
    return <div></div>;
  }
  const { height, width, slots } = inventory;
  return (
    <div
      css={css`
        position: relative;
      `}
    >
      {slots.map((slot) => {
        return (
          <img
            css={css`
              position: absolute;
              width: ${theme.tileSize * slot.item.width};
              height: ${theme.tileSize * slot.item.height};
              top: ${theme.tileSize * slot.y}px;
              left: ${theme.tileSize * slot.x}px;
            `}
            alt={slot.item.name}
            src={slot.item.image}
            key={slot.id}
          />
        );
      })}
      <div
        css={css`
          display: grid;
          width: ${width * theme.tileSize}px;
          height: ${height * theme.tileSize}px;
          grid-template-rows: 1fr 1fr 1fr;
          grid-template-columns: 1fr 1fr 1fr;
        `}
      >
        {range(0, height * width).map((cell) => {
          return (
            <InventorySlot
              addSlot={addSlot}
              moveSlot={moveSlot}
              containerId={inventory.id}
              key={cell}
              x={cell % height}
              y={Math.floor(cell / width)}
            />
          );
        })}
      </div>
    </div>
  );
};
