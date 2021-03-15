import React from "react";
import { useDispatch } from "react-redux";
import { Button } from "./Button";

export const Debug = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <div>
        <Button
          onClick={() => {
            dispatch({ type: "RESET" });
          }}
        >
          Reset
        </Button>
        <Button
          onClick={() => {
            dispatch({ type: "CHEAT", payload: { type: "AUTOMATION" } });
          }}
        >
          Cheat: All Automation
        </Button>
        <Button
          onClick={() => {
            dispatch({ type: "CHEAT", payload: { type: "MIDGAME" } });
          }}
        >
          Cheat: Mid Upgrades
        </Button>
      </div>
    </div>
  );
};
