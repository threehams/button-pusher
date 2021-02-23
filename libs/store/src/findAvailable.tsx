import { range } from "lodash";

type FindAvailable = {
  grid: unknown[][];
  startX: number;
  startY: number;
  width: number;
  height: number;
};
export const findAvailable = ({
  grid,
  startX,
  startY,
  width,
  height,
}: FindAvailable) => {
  let availableRight = 0;
  let availableDown = 0;
  for (const x of range(startX + 1, width)) {
    if (grid[startY][x]) {
      break;
    }
    availableRight += 1;
  }
  for (const y of range(startY + 1, height)) {
    if (grid[y][startX]) {
      break;
    }
    availableDown += 1;
  }
  return { availableRight, availableDown };
};
