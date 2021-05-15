import React, { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "../components/Button";
import { Game } from "../components/Game";
import { makeStore } from "@botnet/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

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
  const [confirm, setConfirm] = useState(false);
  const [reset, setReset] = useState(false);

  useEffect(() => {
    if (confirm && reset) {
      localStorage.clear();
      location.reload();
    }
  }, [confirm, reset]);
  return (
    <div className="flex items-center justify-center w-full min-h-screen text-center">
      <div className="max-w-2xl">
        <div>Something has gone very wrong. Try reloading the page.</div>
        <div>If that doesn&apos;t work,</div>

        <Button
          className="block my-3 w-full"
          onClick={() => {
            setConfirm(true);
          }}
        >
          click here to reset your game.
        </Button>
        <Button
          className="block my-3 w-full"
          style={{
            visibility: confirm ? "visible" : "hidden",
            pointerEvents: confirm ? "auto" : "none",
          }}
          onClick={() => {
            setReset(true);
          }}
        >
          click here to confirm.
        </Button>
      </div>
    </div>
  );
};
