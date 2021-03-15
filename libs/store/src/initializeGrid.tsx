import { Inventory } from "./Inventory";
import { range } from "lodash";

export const initializeGrid = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const grid: Inventory["grid"] = range(0, height).map(() => {
    return range(0, width).map(() => false);
  });
  return grid;
};
