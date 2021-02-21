import { Theme } from "@emotion/react";

export type SpaceProps = {
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
  marginBottom?: number;
  marginX?: number;
  marginY?: number;
  margin?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingX?: number;
  paddingY?: number;
  padding?: number;
};

type Direction = "left" | "right" | "top" | "bottom";

const paddingMap: {
  [key: string]: Direction[] | undefined;
} = {
  paddingLeft: ["left"],
  paddingRight: ["right"],
  paddingTop: ["top"],
  paddingBottom: ["bottom"],
  paddingX: ["left", "right"],
  paddingY: ["top", "bottom"],
  padding: ["left", "right", "top", "bottom"],
};

const marginMap: {
  [key: string]: Direction[] | undefined;
} = {
  marginLeft: ["left"],
  marginRight: ["right"],
  marginTop: ["top"],
  marginBottom: ["bottom"],
  marginX: ["left", "right"],
  marginY: ["top", "bottom"],
  margin: ["left", "right", "top", "bottom"],
};

/**
 * Given props + theme, set padding + margin to increments based
 * on font size. This lets the monospace console look be preserved
 * without resorting to <br /> and nbsp;.
 */
export const space = (
  props: SpaceProps & {
    theme: Theme;
  },
): string => {
  return Object.entries(props)
    .map(([key, value]): string => {
      if (typeof value !== "number") {
        return "";
      }
      const padding = paddingMap[key];
      if (padding) {
        return padding
          .map((direction) => {
            if (direction === "left" || direction === "right") {
              return `padding-${direction}: ${props.theme.spaceX[value]}px`;
            }
            return `padding-${direction}: ${props.theme.spaceY[value]}px`;
          })
          .join(";");
      }
      const margin = marginMap[key];
      if (margin) {
        return margin
          .map((direction) => {
            if (direction === "left" || direction === "right") {
              return `margin-${direction}: ${props.theme.spaceX[value]}px`;
            }
            return `margin-${direction}: ${props.theme.spaceY[value]}px`;
          })
          .join(";");
      }
      return "";
    })
    .join(";");
};
