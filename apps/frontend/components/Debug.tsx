import { useStoreValue } from "@botnet/store";
import React from "react";
import { Button } from "./Button";

export const Debug = () => {
  const { reset, cheat } = useStoreValue();
  return (
    <div>
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
  );
};
