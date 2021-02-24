import {
  AddSlot,
  BuyContainerUpgrade,
  Inventory,
  MoveSlot,
} from "@botnet/store";
import React, { useEffect, useRef, useState } from "react";
import { range } from "lodash";
import { css, useTheme } from "@emotion/react";
import { InventorySlot } from "../InventorySlot";
import { InventoryItem } from "../InventoryItem";
import { useDrop, XYCoord } from "react-dnd";
import { DraggableItem, DraggableResult } from "../DraggableItem";
import { Item } from "@botnet/messages";

type InventoryPanelProps = {
  inventory: Inventory;
  addSlot: AddSlot;
  moveSlot: MoveSlot;
  buyContainerUpgrade: BuyContainerUpgrade;
};
export const InventoryPanel = ({
  inventory,
  buyContainerUpgrade,
  addSlot,
}: InventoryPanelProps) => {
  const { height, width, slots, grid, nextUpgrade } = inventory;

  const theme = useTheme();
  const ref = useRef<HTMLDivElement | null>(null);
  const [targetPos, setTargetPos] = useState<Coords | undefined>(undefined);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const { x, y } = ref.current.getBoundingClientRect();
    if (targetPos?.x !== x || targetPos?.y !== y) {
      setTargetPos({ x, y });
    }
  }, [targetPos?.x, targetPos?.y]);
  const [{ position, item }, drop] = useDrop<
    DraggableItem,
    DraggableResult,
    { position: XYCoord | null; item: Item | undefined }
  >({
    collect: (monitor) => {
      return { position: monitor.getClientOffset(), item: monitor.getItem() };
    },
    accept: ["ITEM"],
    canDrop: (dragged, monitor) => {
      if (!targetPos) {
        return false;
      }
      const { x, y } = monitor.getClientOffset()!;
      return !!getTargetCoords({
        inventory,
        item: dragged.item,
        position: { x, y },
        targetPos,
        tileSize: theme.tileSize,
      })?.valid;
    },
    drop: (dragged, monitor) => {
      const { x, y } = monitor.getClientOffset()!;
      const coords = getTargetCoords({
        inventory,
        item: dragged.item,
        position: { x, y },
        targetPos: targetPos!,
        tileSize: theme.tileSize,
      })!;
      return { x: coords.x, y: coords.y, containerId: inventory.id };
    },
  });

  const targetCoords =
    position && targetPos && item
      ? getTargetCoords({
          inventory,
          item,
          position: { x: position.x, y: position.y },
          targetPos,
          tileSize: theme.tileSize,
        })
      : undefined;

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
              addSlot={addSlot}
              item={slot.item}
              slotId={slot.id}
            />
          );
        })}
        <div
          ref={(element) => {
            drop(element);
            ref.current = element;
          }}
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
            return gridRow.map((_, col) => {
              const required = !!targetCoords?.required.includes(
                `${col},${row}`,
              );
              return (
                <InventorySlot
                  key={`${col}${row}`}
                  required={required}
                  state={required && targetCoords?.valid ? "VALID" : "INVALID"}
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

type Coords = { x: number; y: number };

type GetTargetCoords = {
  item: Item;
  position: Coords;
  tileSize: number;
  targetPos: Coords;
  inventory: Inventory;
};
const getTargetCoords = ({
  item,
  position,
  tileSize,
  targetPos,
  inventory,
}: GetTargetCoords) => {
  const { width, height, grid } = inventory;
  const offsetX = ((item.width - 1) * tileSize) / 2;
  const offsetY = ((item.height - 1) * tileSize) / 2;
  const x = Math.floor((position.x - targetPos.x - offsetX) / tileSize);
  const y = Math.floor((position.y - targetPos.y - offsetY) / tileSize);
  if (x < 0 || y < 0 || x >= width || y >= height) {
    return undefined;
  }
  let required = [];
  let valid = true;
  for (const row of range(y, y + item.height)) {
    for (const col of range(x, x + item.width)) {
      if (row < height && col < width) {
        required.push(`${col},${row}`);
        if (grid[col][row]) {
          valid = false;
        }
      } else {
        valid = false;
      }
    }
  }
  return {
    x,
    y,
    width: item.width,
    height: item.height,
    required,
    valid,
  };
};
