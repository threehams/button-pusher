import { range } from "lodash";
import { FullSlot } from "../FullSlot";

export const recalculateGrid = ({
  slots,
  grid,
}: {
  slots: FullSlot[];
  grid: (string | false)[][];
}) => {
  slots.forEach((slot) => {
    range(0, slot.item.height).forEach((row) => {
      range(0, slot.item.width).forEach((col) => {
        grid[slot.y + row][slot.x + col] = slot.id;
      });
    });
  });
};
