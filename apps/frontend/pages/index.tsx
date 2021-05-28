import React, { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "../components/Button";
import { Game } from "../components/Game";
import { makeStore } from "@botnet/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useResetMachine } from "../lib/useResetMachine";

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

const Reset = () => {
  const [state, send] = useResetMachine();

  return (
    <div className="flex items-center justify-center min-h-screen text-center w-full">
      <div className="max-w-2xl">
        <div>Something has gone very wrong. Try reloading the page.</div>
        <div>If that doesn&apos;t work,</div>

        <Button
          className="block my-3 w-full"
          onClick={() => {
            send("RESET");
          }}
        >
          click here to reset your game.
        </Button>
        <Button
          className="block my-3 w-full"
          style={{
            visibility:
              state.value === "needsConfirmation" ? "visible" : "hidden",
            pointerEvents:
              state.value === "needsConfirmation" ? "auto" : "none",
          }}
          onClick={() => {
            send("CONFIRM");
          }}
        >
          click here to confirm.
        </Button>
      </div>
    </div>
  );
};
