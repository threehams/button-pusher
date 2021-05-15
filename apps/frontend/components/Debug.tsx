import React from "react";
import { useDispatch } from "react-redux";
import { usePlayerId } from "../hooks/PlayerContext";
import { Button } from "./Button";

export const Debug = () => {
  const dispatch = useDispatch();
  const playerId = usePlayerId();

  return (
    <div>
      <div>
        <Button
          className="mr-2"
          onClick={() => {
            dispatch({ type: "RESET" });
          }}
        >
          Reset
        </Button>
        <Button
          className="mr-2"
          onClick={() => {
            dispatch({
              type: "CHEAT",
              payload: { type: "AUTOMATION", playerId },
            });
          }}
        >
          Cheat: All Automation
        </Button>
        <Button
          className="mr-2"
          onClick={() => {
            dispatch({ type: "CHEAT", payload: { type: "MIDGAME", playerId } });
          }}
        >
          Cheat: Mid Upgrades
        </Button>
      </div>
    </div>
  );
};
