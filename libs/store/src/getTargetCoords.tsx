import { Inventory } from "./Inventory";
import { range } from "lodash";

export type SlotInfo = {
  x: number;
  y: number;
  width: number;
  height: number;
  slotId: string | undefined;
};

type GetTargetCoords = {
  target: SlotInfo;
  inventory: Pick<Inventory, "width" | "height" | "grid">;
};
export const getTargetCoords = ({ target, inventory }: GetTargetCoords) => {
  const { x, y } = target;
  const { width, height, grid } = inventory;
  let required = [];
  let valid = true;
  for (const row of range(y, y + target.height)) {
    for (const col of range(x, x + target.width)) {
      if (row < height && col < width) {
        required.push(`${row},${col}`);
        if (grid[row][col] && grid[row][col] !== target.slotId) {
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
