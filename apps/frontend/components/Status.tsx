import React from "react";

type StatusProps = {
  ready: boolean;
};
export const Status = ({ ready }: StatusProps) => {
  return <div>Status: {ready ? "Connected" : "Closed"}</div>;
};
