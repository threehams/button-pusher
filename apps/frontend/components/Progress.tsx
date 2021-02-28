import { css } from "@emotion/react";
import React from "react";
import { Button } from "./Button";

type ProgressProps = {
  percent: number;
  children: React.ReactNode;
  button?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler;
};
export const Progress = ({
  percent,
  button = false,
  children,
  disabled,
  onClick,
}: ProgressProps) => {
  const percentage = Math.min(Math.max(0, percent), 100);
  const Tag = button ? Button : "div";
  return (
    <Tag
      disabled={disabled}
      onClick={onClick}
      css={css`
        outline: 1px solid #f8f8f8;
        width: 100%;
        position: relative;
      `}
    >
      <div
        css={css`
          background-color: #666;
          position: absolute;
          width: 100%;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          height: 100%;
          transform-origin: top left;
          transform: scaleX(${percentage / 100});
        `}
      />
      <div
        css={css`
          position: relative;
          z-index: 1;
          text-align: center;
        `}
      >
        {children}
      </div>
    </Tag>
  );
};
