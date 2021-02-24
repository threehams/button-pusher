import { css, useTheme } from "@emotion/react";
import React from "react";

type InventorySlotProps = {
  children?: React.ReactNode;
};
export const InventorySlot = ({ children }: InventorySlotProps) => {
  const theme = useTheme();
  return (
    <button
      css={css`
        border: 1px solid white;
        width: ${theme.tileSize};
        height: ${theme.tileSize};
      `}
    >
      {children}
    </button>
  );
};
