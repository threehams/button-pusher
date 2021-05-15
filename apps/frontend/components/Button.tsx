import React, { CSSProperties } from "react";
import clsx from "clsx";

type ButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler;
  className?: string;
  style?: CSSProperties;
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
      className={clsx(
        "border border-solid border-gray-50 relative cursor-pointer px-3",
        className,
      )}
    >
      {children}
    </button>
  );
};
