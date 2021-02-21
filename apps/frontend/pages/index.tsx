import { useStore } from "@botnet/store";
import { Box } from "@botnet/ui";
import { css, useTheme } from "@emotion/react";
import React from "react";
import { HeldItemPanel, InventoryPanel } from "../components";
import { TerminalOverlay } from "../components/TerminalOverlay";
import { useGameLoop } from "../hooks/useGameLoop";

export const Index = () => {
  const { heldItem, inventory, setHeldItem } = useStore();

  const theme = useTheme();
  useGameLoop();

  return (
    <>
      <TerminalOverlay />
      <Box
        css={css`
          min-height: 100vh;
        `}
      >
        <>
          <Box
            css={css`
              display: inline-block;
              width: ${theme.tileWidth * 24}px;
              position: sticky;
              top: 0;
              vertical-align: top;
            `}
            paddingLeft={2}
            paddingTop={1}
          >
            <InventoryPanel inventory={inventory} />
          </Box>
          <Box
            css={css`
              display: inline-block;
              width: calc(100% - ${theme.tileWidth * 24}px);
            `}
            paddingX={1}
            paddingY={1}
          >
            <HeldItemPanel item={heldItem} />
          </Box>
        </>
      </Box>
    </>
  );
};

export default Index;
