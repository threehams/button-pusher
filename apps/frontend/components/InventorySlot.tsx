import { css, useTheme } from "@emotion/react";
import React from "react";

type InventorySlotProps = {
  children?: React.ReactNode;
  state: "VALID" | "INVALID";
  required: boolean;
};
export const InventorySlot = React.memo(
  ({ children, required, state }: InventorySlotProps) => {
    const theme = useTheme();

    return (
      <button
        css={css`
          border: 1px solid white;
          width: ${theme.tileSize};
          height: ${theme.tileSize};
          background-color: ${required && state === "VALID"
            ? "green"
            : required && state === "INVALID"
            ? "RED"
            : "transparent"};
        `}
      >
        {children}
      </button>
    );
  },
);
