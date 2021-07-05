import React from "react";
import { Button } from "./Button";
import { useResetMachine } from "../lib/useResetMachine";

export const Reset = () => {
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
