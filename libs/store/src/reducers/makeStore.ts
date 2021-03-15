import { createStore } from "redux";
import { rootReducer } from "./rootReducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: (...args: any[]) => any;
  }
}

const persistedReducer = persistReducer(
  { key: "youAreOverburdenedSave", storage },
  rootReducer,
);

export const makeStore = () => {
  const store = createStore(
    persistedReducer,
    typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : (f) => f,
  );
  const persistor = persistStore(store);
  return { store, persistor };
};
