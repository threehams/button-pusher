import { Static, Dictionary } from "runtypes";
import { Item } from "./Item";

export const ItemMap = Dictionary(Item);
export type ItemMap = Static<typeof ItemMap>;
