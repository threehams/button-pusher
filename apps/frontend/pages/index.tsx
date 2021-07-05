import React, { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Game } from "../components/Game";
import { makeStore } from "@botnet/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Reset } from "../components/Reset";

const { store, persistor } = makeStore();

export const Index = () => {
  const [onClient, setOnClient] = useState(false);
  useEffect(() => {
    setOnClient(true);
  }, []);

  return (
    <ErrorBoundary FallbackComponent={Reset}>
      {onClient && (
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Game />
          </PersistGate>
        </Provider>
      )}
    </ErrorBoundary>
  );
};

export default Index;
