import { AutomatedUpgrade, PurchasedUpgrade } from "@botnet/store";
import React from "react";
import { Progress } from "./Progress";
import { Button } from "./Button";
import { useDispatch } from "react-redux";
import { usePlayerId } from "../hooks/PlayerContext";

type AutoActionProps = {
  percent: number;
  children: React.ReactNode;
  disabled: boolean;
  onClick: React.MouseEventHandler;
  upgrade: PurchasedUpgrade;
  upgradeName: AutomatedUpgrade;
};
export const AutoAction = ({
  children,
  disabled,
  onClick,
  upgrade,
  percent,
  upgradeName,
}: AutoActionProps) => {
  const dispatch = useDispatch();
  const playerId = usePlayerId();

  return (
    <div className="flex flex-nowrap flex-row">
      <Progress button disabled={disabled} percent={percent} onClick={onClick}>
        {children}
      </Progress>
      <Button
        className="flex-grow flex-shrink-0 flex-auto ml-3"
        onClick={() => {
          upgrade.enabled
            ? dispatch({
                type: "DISABLE",
                payload: { playerId, upgrade: upgradeName },
              })
            : dispatch({
                type: "ENABLE",
                payload: { playerId, upgrade: upgradeName },
              });
        }}
      >
        Auto: {upgrade.enabled ? "On" : "Off"}
      </Button>
    </div>
  );
};
