import { Array, String, Record, Number, Lazy, Runtype } from "runtypes";

export type Container = {
  id: string;
  width: number;
  height: number;
  slotIds: string[];
  cost: number;
  upgrades?: Container[];
};
export const Container: Runtype<Container> = Lazy(() =>
  Record({
    id: String,
    width: Number,
    height: Number,
    slotIds: Array(String),
    cost: Number,
    upgrades: Array(Container),
  }),
);
