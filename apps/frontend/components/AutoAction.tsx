import { AutomatedUpgrade, PurchasedUpgrade } from "@botnet/store";
import React from "react";
import { Progress } from "./Progress";
import { Button } from "./Button";
import { useDispatch } from "react-redux";
import { usePlayer } from "../hooks/PlayerContext";

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
  const player = usePlayer();

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
                payload: { playerId: player.id, upgrade: upgradeName },
              })
            : dispatch({
                type: "ENABLE",
                payload: { playerId: player.id, upgrade: upgradeName },
              });
        }}
      >
        Auto: {upgrade.enabled ? "On" : "Off"}
      </Button>
    </div>
  );
};
