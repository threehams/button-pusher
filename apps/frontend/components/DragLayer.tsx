import { css, useTheme } from "@emotion/react";
import React from "react";
import { CSSProperties } from "react";
import { XYCoord, useDragLayer } from "react-dnd";

const layerStyles: CSSProperties = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 100,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
};

function getItemStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null,
) {
  if (!initialOffset || !currentOffset) {
    return {
      display: "none",
    };
  }

  let { x, y } = currentOffset;

  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
  };
}

export const CustomDragLayer = () => {
  const theme = useTheme();
  const { isDragging, item, initialOffset, currentOffset } = useDragLayer(
    (monitor) => ({
      item: monitor.getItem(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }),
  );

  if (!isDragging) {
    return null;
  }
  return (
    <div style={layerStyles} id="drag-layer">
      <div style={getItemStyles(initialOffset, currentOffset)}>
        <img
          src={item.image}
          alt={item.name}
          css={css`
            width: ${item.width * theme.tileSize}px;
            height: ${item.height * theme.tileSize}px;
            opacity: ${isDragging ? 0 : 1};
          `}
        />
      </div>
    </div>
  );
};
