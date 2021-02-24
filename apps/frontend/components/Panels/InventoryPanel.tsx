import {
  AddSlot,
  BuyContainerUpgrade,
  findAvailable,
  Inventory,
  MoveSlot,
} from "@botnet/store";
import React from "react";
import { range } from "lodash";
import { css, useTheme } from "@emotion/react";
import { InventorySlot } from "../InventorySlot";
import { InventoryItem } from "../InventoryItem";

type InventoryPanelProps = {
  inventory: Inventory | undefined;
  addSlot: AddSlot;
  moveSlot: MoveSlot;
  buyContainerUpgrade: BuyContainerUpgrade;
};
export const InventoryPanel = ({
  inventory,
  addSlot,
  moveSlot,
  buyContainerUpgrade,
}: InventoryPanelProps) => {
  const theme = useTheme();

  if (!inventory) {
    return <div></div>;
  }
  const { height, width, slots, grid, nextUpgrade } = inventory;
  return (
    <div>
      <div
        css={css`
          position: relative;
        `}
      >
        {slots.map((slot) => {
          return (
            <InventoryItem
              key={slot.id}
              css={css`
                position: absolute;
                width: ${theme.tileSize * slot.item.width};
                height: ${theme.tileSize * slot.item.height};
                top: ${theme.tileSize * slot.y}px;
                left: ${theme.tileSize * slot.x}px;
              `}
              item={slot.item}
              slotId={slot.id}
            />
          );
        })}
        <div
          css={css`
            display: grid;
            width: ${width * theme.tileSize}px;
            height: ${height * theme.tileSize}px;
            grid-template-rows: ${range(0, height)
              .map(() => "1fr")
              .join(" ")};
            grid-template-columns: ${range(0, width)
              .map(() => "1fr")
              .join(" ")};
          `}
        >
          {grid.map((gridRow, row) => {
            return gridRow.map((item, col) => {
              const available = !item;
              const { availableRight, availableDown } = findAvailable({
                grid,
                startX: col,
                startY: row,
                width,
                height,
              });

              return (
                <InventorySlot
                  available={available}
                  availableRight={availableRight}
                  availableDown={availableDown}
                  addSlot={addSlot}
                  moveSlot={moveSlot}
                  containerId={inventory.id}
                  key={`${row}${col}`}
                  x={col}
                  y={row}
                />
              );
            });
          })}
        </div>
      </div>
      {nextUpgrade && (
        <button
          onClick={() => {
            buyContainerUpgrade({ id: inventory.id });
          }}
        >
          Upgrade ${nextUpgrade.cost}
        </button>
      )}
    </div>
  );
};
