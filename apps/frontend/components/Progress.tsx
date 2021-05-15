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
        className="absolute bottom-0 left-0 right-0 top-0 w-full h-full bg-gray-600 origin-top-left"
        style={{ transform: `scaleX(${percentage / 100})` }}
      />
      <div className="relative z-10 text-center">{children}</div>
    </Tag>
  );
};
