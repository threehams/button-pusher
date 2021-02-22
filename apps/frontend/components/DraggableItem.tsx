import { Item, Slot } from "@botnet/messages";

export type DraggableItem =
  | { type: "ITEM"; item: Item }
  | { type: "SLOT"; item: Slot };
