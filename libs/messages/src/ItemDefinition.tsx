import { Record, String, Number, Static } from "runtypes";
import { Category } from "./Category";

export const ItemDefinition = Record({
  id: String,
  width: Number,
  height: Number,
  name: String,
  image: String,
  value: Number,
  category: Category,
});
export type ItemDefinition = Static<typeof ItemDefinition>;
