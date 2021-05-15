import { Item } from "@botnet/messages";

export type DraggableItem = { item: Item; slotId?: string };
export type DraggableResult = { x: number; y: number; containerId: string };
