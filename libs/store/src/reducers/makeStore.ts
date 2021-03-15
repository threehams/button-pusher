import { createStore } from "redux";
import { rootReducer } from "./rootReducer";
import { getStoreCache } from "./storeCache";

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: (...args: any[]) => any;
  }
}

export const makeStore = () => {
  return createStore(
    rootReducer,
    getStoreCache(),
    typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : (f) => f,
  );
};
