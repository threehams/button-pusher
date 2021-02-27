import React from "react";

type ProgressProps = {
  percent: number;
};
export const Progress = ({ percent }: ProgressProps) => {
  return <div>{percent}%</div>;
};
