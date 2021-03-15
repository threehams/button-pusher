import { css } from "@emotion/react";
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
    <div
      css={css`
        width: 100%;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
      `}
    >
      <div
        css={css`
          max-width: 600px;
        `}
      >
        <div>Something has gone very wrong. Try reloading the page.</div>
        <div>If that doesn&apos;t work,</div>

        <Button
          css={css`
            display: block;
            width: 100%;
            margin: 20px 0;
          `}
          onClick={() => {
            setConfirm(true);
          }}
        >
          click here to reset your game.
        </Button>
        <Button
          css={css`
            display: block;
            width: 100%;
            margin: 20px 0;
            visibility: ${confirm ? "visible" : "hidden"};
            pointer-events: ${confirm ? "auto" : "none"};
          `}
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
