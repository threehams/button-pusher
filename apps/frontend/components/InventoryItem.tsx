import { Item, Rarity } from "@botnet/messages";
import { AddSlot, MoveSlot } from "@botnet/store";
import { css, useTheme } from "@emotion/react";
import React, { useState } from "react";
import { useDrag } from "react-dnd";
import ReactDOM from "react-dom";
import { DraggableItem, DraggableResult } from "./DraggableItem";

const FILTERS: { [Key in Rarity]: string } = {
  JUNK:
    "invert(67%) sepia(0%) saturate(1063%) hue-rotate(253deg) brightness(94%) contrast(91%)",
  COMMON:
    "invert(100%) sepia(1%) saturate(286%) hue-rotate(62deg) brightness(118%) contrast(95%)",
  UNCOMMON:
    "invert(54%) sepia(68%) saturate(443%) hue-rotate(67deg) brightness(97%) contrast(110%)",
  RARE:
    "invert(67%) sepia(6%) saturate(4983%) hue-rotate(181deg) brightness(92%) contrast(85%)",
  EPIC:
    "invert(27%) sepia(68%) saturate(2039%) hue-rotate(273deg) brightness(108%) contrast(93%)",
  LEGENDARY:
    "invert(73%) sepia(67%) saturate(784%) hue-rotate(342deg) brightness(101%) contrast(101%)",
};

type InventoryItemProps = {
  item: Item;
  slotId?: string;
  className?: string;
  addSlot: AddSlot;
  moveSlot: MoveSlot;
};
export const InventoryItem = React.memo(
  ({ item, slotId, className, addSlot, moveSlot }: InventoryItemProps) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState<
      | {
          x: number;
          y: number;
        }
      | undefined
    >(undefined);
    const theme = useTheme();
    const [{ isDragging }, drag] = useDrag<
      DraggableItem,
      DraggableResult,
      { isDragging: boolean }
    >({
      item: {
        type: "ITEM",
        item,
        slotId,
      },
      collect: (monitor) => {
        return {
          isDragging: !!monitor.isDragging(),
        };
      },
      end: (_, monitor) => {
        const result: DraggableResult | undefined = monitor.getDropResult();
        if (result) {
          const { x, y, containerId } = result;
          if (slotId) {
            moveSlot({ x, y, containerId, slotId });
          } else {
            addSlot({ x, y, containerId, itemId: item.id });
          }
        }
      },
    });

    return (
      <>
        <div
          onMouseEnter={() => {
            setTooltipOpen(true);
          }}
          onMouseOut={() => {
            setTooltipOpen(false);
          }}
          onMouseMove={(event) => {
            setTooltipPosition({ x: event.clientX, y: event.clientY });
          }}
          ref={drag}
          css={css`
            filter: ${FILTERS[item.rarity]};
            background: url(${item.image}) center no-repeat;
            position: relative;
            z-index: 3;
            cursor: pointer;
            width: ${item.width * theme.tileSize}px;
            height: ${item.height * theme.tileSize}px;
            opacity: ${isDragging ? 0 : 1};
            pointer-events: ${isDragging ? "none" : "auto"};
          `}
          className={className}
        />
        {tooltipOpen && !isDragging && (
          <Tooltip position={tooltipPosition}>
            <div>{item.name}</div>
            <p>{item.rarity}</p>
            <p>${item.value}</p>
          </Tooltip>
        )}
      </>
    );
  },
);

type TooltipProps = {
  children: React.ReactNode;
  position: { x: number; y: number } | undefined;
};
const Tooltip = ({ children, position }: TooltipProps) => {
  if (!position) {
    return null;
  }
  return ReactDOM.createPortal(
    <div
      css={css`
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 0;
        transform: translate(${position.x}px, ${position.y}px);
        padding: 20px;
        border: 1px solid #ccc;
        background-color: #060606;
        z-index: 100;
      `}
    >
      {children}
    </div>,
    document.querySelector("#tooltip")!,
  );
};
