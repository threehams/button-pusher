import { AutomatedUpgrade, PurchasedUpgrade } from "@botnet/store";
import { css } from "@emotion/react";
import React from "react";
import { Progress } from "./Progress";
import { Button } from "./Button";
import { useDispatch } from "react-redux";

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

  return (
    <div
      css={css`
        display: flex;
        flex: row nowrap;
      `}
    >
      <Progress button disabled={disabled} percent={percent} onClick={onClick}>
        {children}
      </Progress>
      <Button
        css={css`
          flex: 1 0 auto;
          margin-left: 20px;
        `}
        onClick={() => {
          upgrade.enabled
            ? dispatch({ type: "DISABLE", payload: { upgrade: upgradeName } })
            : dispatch({ type: "ENABLE", payload: { upgrade: upgradeName } });
        }}
      >
        Auto: {upgrade.enabled ? "On" : "Off"}
      </Button>
    </div>
  );
};
