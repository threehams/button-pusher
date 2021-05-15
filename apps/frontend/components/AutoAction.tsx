import { AutomatedUpgrade, PurchasedUpgrade } from "@botnet/store";
import React from "react";
import { Progress } from "./Progress";
import { Button } from "./Button";
import { useDispatch } from "react-redux";
import { usePlayerId } from "../hooks/PlayerContext";
import clsx from "clsx";

type AutoActionProps = {
  percent: number;
  children: React.ReactNode;
  disabled: boolean;
  onClick: React.MouseEventHandler;
  upgrade: PurchasedUpgrade;
  upgradeName: AutomatedUpgrade;
  className?: string;
};
export const AutoAction = ({
  children,
  disabled,
  onClick,
  upgrade,
  percent,
  upgradeName,
  className,
}: AutoActionProps) => {
  const dispatch = useDispatch();
  const playerId = usePlayerId();

  return (
    <div className={clsx("flex flex-row flex-nowrap", className)}>
      <Progress button disabled={disabled} percent={percent} onClick={onClick}>
        {children}
      </Progress>
      <Button
        className="flex-auto flex-grow flex-shrink-0 ml-3"
        disabled={upgrade.level === 0}
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
        Auto: {upgrade.enabled ? "On\u00A0" : "Off"}
      </Button>
    </div>
  );
};
