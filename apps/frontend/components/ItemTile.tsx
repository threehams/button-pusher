import { Item, Rarity } from "@botnet/messages";
import { theme } from "@botnet/ui";
import clsx from "classnames";
import React from "react";

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

type Props = React.ComponentProps<"div"> & {
  item: Item;
  visible: boolean;
  preview?: boolean;
};
export const ItemTile = React.forwardRef<HTMLDivElement, Props>(
  ({ item, visible, preview, className, style, ...rest }, ref) => {
    return (
      <div
        id="dragging-item"
        data-item={item.id}
        ref={ref}
        style={{
          ...style,
          width: item.width * theme.tileSize,
          height: item.height * theme.tileSize,
          filter: FILTERS[item.rarity],
          opacity: visible ? 1 : 0,
          background: `url(${item.image}) center no-repeat`,
          pointerEvents: visible && !preview ? "auto" : "none",
        }}
        className={clsx("cursor-pointer z-30", className)}
        {...rest}
      />
    );
  },
);
