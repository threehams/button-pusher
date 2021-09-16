import React, { useState } from "react";

type AccordionProps = {
  title: string;
  children?: React.ReactNode;
};
export const Accordion = ({ title, children }: AccordionProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        className="flex items-center justify-between w-full"
        onClick={() => {
          setOpen((current) => !current);
        }}
      >
        <span>{title}</span>{" "}
        <span className="font-bold">{open ? "-" : "+"}</span>
      </button>
      {open ? children : null}
    </div>
  );
};

type AccordionItemProps = {
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};
export const AccordionItem = ({ children, onClick }: AccordionItemProps) => {
  return (
    <button className="block w-full" onClick={onClick}>
      {children}
    </button>
  );
};
