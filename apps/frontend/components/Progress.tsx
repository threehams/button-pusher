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
    <Tag disabled={disabled} onClick={onClick} className="w-full relative">
      <div
        className="bg-gray-600 absolute w-full top-0 left-0 right-0 bottom-0 h-full origin-top-left"
        style={{ transform: `scaleX(${percentage / 100})` }}
      />
      <div className="relative z-10 text-center">{children}</div>
    </Tag>
  );
};
