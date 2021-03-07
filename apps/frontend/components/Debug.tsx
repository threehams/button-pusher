import { useStoreValue } from "@botnet/store";
import React, { useState } from "react";
import { Button } from "./Button";

export const Debug = () => {
  const store = useStoreValue();
  const { reset, cheat } = store;
  const [showState, setShowState] = useState(false);

  return (
    <div>
      <div>
        <Button
          onClick={() => {
            setShowState((current) => !current);
          }}
        >
          {showState ? "Hide State" : "Show State"} state
        </Button>
        <Button
          onClick={() => {
            reset();
          }}
        >
          Reset
        </Button>
        <Button
          onClick={() => {
            cheat("AUTOMATION");
          }}
        >
          Cheat: All Automation
        </Button>
        <Button
          onClick={() => {
            cheat("MIDGAME");
          }}
        >
          Cheat: Mid Upgrades
        </Button>
      </div>
      {showState && <div>{JSON.stringify(store)}</div>}
    </div>
  );
};
