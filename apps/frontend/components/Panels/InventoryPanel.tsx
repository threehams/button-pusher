import {
  AddSlot,
  BuyContainerUpgrade,
  Inventory,
  MoveSlot,
} from "@botnet/store";
import React, { useCallback, useState } from "react";
import { range } from "lodash";
import { css, useTheme } from "@emotion/react";
import { InventorySlot } from "../InventorySlot";
import { InventoryItem } from "../InventoryItem";
import deepEqual from "deep-equal";

type Bounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

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
  const { height, width, slots, nextUpgrade } = inventory;
  const [target, setTargetState] = useState<Bounds | undefined>();

  const setTarget = useCallback(
    (tgt: Bounds | undefined) => {
      if (!deepEqual(target, tgt)) {
        setTargetState(tgt);
      }
    },
    [target],
  );

  const theme = useTheme();
  const canDrop = useCallback(
    (tgt: Bounds) => {
      return !!getTargetCoords({ inventory, target: tgt })?.valid;
    },
    [inventory],
  );
  const targetCoords = target
    ? getTargetCoords({
        inventory,
        target,
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
                /* pointer-events: none; */
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
          {range(0, height).map((y) => {
            return range(0, width).map((x) => {
              const required = !!targetCoords?.required.includes(`${x},${y}`);
              return (
                <InventorySlot
                  containerId={inventory.id}
                  setTarget={setTarget}
                  canDrop={canDrop}
                  x={x}
                  y={y}
                  key={`${x}${y}`}
                  required={required}
                  state={required && targetCoords?.valid ? "VALID" : "INVALID"}
                >
                  {x},{y}
                </InventorySlot>
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

type GetTargetCoords = {
  target: Bounds;
  inventory: Inventory;
};
const getTargetCoords = ({ target, inventory }: GetTargetCoords) => {
  const { x, y } = target;
  const { width, height, grid } = inventory;
  let required = [];
  let valid = true;
  for (const row of range(y, y + target.height)) {
    for (const col of range(x, x + target.width)) {
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
    width: target.width,
    height: target.height,
    required,
    valid,
  };
};
