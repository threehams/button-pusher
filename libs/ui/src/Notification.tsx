import React from "react";

type NotificationProps = {
  children?: React.ReactNode;
};
export const Notification = ({ children }: NotificationProps) => {
  return (
    <span className="inline-block px-1 text-white bg-red-700">{children}</span>
  );
};
