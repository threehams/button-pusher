import { css } from "@emotion/react";
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler;
  className?: string;
};
export const Button = ({
  children,
  className,
  disabled,
  onClick,
}: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={(event) => {
        if (!disabled) {
          onClick?.(event);
        }
      }}
      css={css`
        outline: 1px solid #f8f8f8;
        position: relative;
        cursor: pointer;
        padding: 0 20px;
      `}
      className={className}
    >
      {children}
    </button>
  );
};
