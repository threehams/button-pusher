import {
  AutomatedUpgrade,
  PurchasedUpgrade,
  useStoreValue,
} from "@botnet/store";
import { css } from "@emotion/react";
import React from "react";
import { Progress } from "./Progress";
import { Button } from "./Button";

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
  const { disable, enable } = useStoreValue();

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
          upgrade.enabled ? disable(upgradeName) : enable(upgradeName);
        }}
      >
        Auto: {upgrade.enabled ? "On" : "Off"}
      </Button>
    </div>
  );
};
