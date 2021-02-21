import { Union, Record, String, Literal, Static } from "runtypes";
import { Container } from "./Container";

export const TerminalMessage = Record({
  update: Literal("Terminal"),
  payload: Record({
    message: String,
  }),
});
export type TerminalMessage = Static<typeof TerminalMessage>;

export const InventoryMessage = Record({
  update: Literal("Inventory"),
  payload: Record({
    inventory: Container,
  }),
});
export type InventoryMessage = Static<typeof InventoryMessage>;

export const Message = Union(TerminalMessage, InventoryMessage);
export type Message = Static<typeof Message>;
