import { Component } from "../components";

type CommandProps = {
  args: Array<string | undefined>;
  addMessage: (message: string) => void;
  addEvent: (component: Component) => void;
  command: string;
};
export type ServerCommandHandler = (props: CommandProps) => void;
