import { Item } from "@botnet/messages";

export type DraggableItem = { type: "ITEM"; item: Item; slotId?: string };
