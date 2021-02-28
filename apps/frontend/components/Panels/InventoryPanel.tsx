import {
  AddSlot,
  BuyContainerUpgrade,
  Inventory,
  MoveSlot,
  SlotInfo,
} from "@botnet/store";
import React, { useCallback, useState } from "react";
import { range } from "lodash";
import { css, useTheme } from "@emotion/react";
import { InventorySlot } from "../InventorySlot";
import { InventoryItem } from "../InventoryItem";
import deepEqual from "deep-equal";
import { getTargetCoords } from "@botnet/store";
import { Button } from "../Button";

type InventoryPanelProps = {
  inventory: Inventory;
  addSlot: AddSlot;
  moveSlot: MoveSlot;
  buyContainerUpgrade: BuyContainerUpgrade;
  moneys: number;
};
export const InventoryPanel = ({
  inventory,
  buyContainerUpgrade,
  addSlot,
  moveSlot,
  moneys,
}: InventoryPanelProps) => {
  const { height, width, slots, cost } = inventory;
  const [target, setTargetState] = useState<SlotInfo | undefined>();

  const setTarget = useCallback(
    (tgt: SlotInfo | undefined) => {
      if (!deepEqual(target, tgt)) {
        setTargetState(tgt);
      }
    },
    [target],
  );

  const theme = useTheme();
  const canDrop = useCallback(
    (tgt: SlotInfo) => {
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
      <Button
        disabled={!cost || cost > moneys}
        onClick={() => {
          buyContainerUpgrade({ id: inventory.id });
        }}
      >
        Upgrade Bag: {cost ? `$${cost}` : "MAX"}
      </Button>

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
              moveSlot={moveSlot}
              item={slot.item}
              slotId={slot.id}
            />
          );
        })}
        <div
          css={css`
            display: grid;
            border-top: 1px solid #888;
            border-left: 1px solid #888;
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
              const required = !!targetCoords?.required.includes(`${y},${x}`);
              return (
                <InventorySlot
                  containerId={inventory.id}
                  setTarget={setTarget}
                  canDrop={canDrop}
                  x={x}
                  y={y}
                  key={`${y}${x}`}
                  required={required}
                  state={required && targetCoords?.valid ? "VALID" : "INVALID"}
                ></InventorySlot>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
};
