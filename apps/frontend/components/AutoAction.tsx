import { AutomatedUpgrade, PurchasedUpgrade } from "@botnet/store";
import React from "react";
import { Progress } from "./Progress";
import { Button } from "./Button";
import { useDispatch } from "react-redux";
import { usePlayerId } from "../hooks/PlayerContext";
import classNames from "classnames";

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
    <div className={classNames("flex flex-nowrap flex-row", className)}>
      <Progress button disabled={disabled} percent={percent} onClick={onClick}>
        {children}
      </Progress>
      <Button
        className="flex-grow flex-shrink-0 flex-auto ml-3"
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
