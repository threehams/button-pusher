import { Inventory } from "./Inventory";
import { range } from "lodash";
import { getTargetCoords } from "./getTargetCoords";

export type SortMethod = "horizontal" | "vertical";
export const findSlot = ({
  containerInv,
  width,
  height,
  method,
}: {
  containerInv: Pick<Inventory, "width" | "height" | "grid">;
  width: number;
  height: number;
  method: SortMethod;
}) => {
  if (method === "horizontal") {
    for (const y of range(0, containerInv.height)) {
      for (const x of range(0, containerInv.width)) {
        const targetCoords = getTargetCoords({
          inventory: containerInv,
          target: {
            x,
            y,
            width,
            height,
            slotId: undefined,
          },
        });
        if (targetCoords.valid) {
          return { x, y };
        }
      }
    }
  } else if (method === "vertical") {
    for (const x of range(0, containerInv.width)) {
      for (const y of range(0, containerInv.height)) {
        const targetCoords = getTargetCoords({
          inventory: containerInv,
          target: {
            x,
            y,
            width,
            height,
            slotId: undefined,
          },
        });
        if (targetCoords.valid) {
          return { x, y };
        }
      }
    }
  }
};
