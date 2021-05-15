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
    <Tag disabled={disabled} onClick={onClick} className="relative w-full">
      <div
        className="absolute bg-gray-600 bottom-0 h-full left-0 origin-top-left right-0 top-0 w-full"
        style={{ transform: `scaleX(${percentage / 100})` }}
      />
      <div className="relative text-center z-10">{children}</div>
    </Tag>
  );
};
