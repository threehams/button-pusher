import { State } from "../State";

let cache: State | undefined;

export const setStoreCache = (value: State) => {
  cache = value;
};

export const getStoreCache = () => {
  return cache;
};
