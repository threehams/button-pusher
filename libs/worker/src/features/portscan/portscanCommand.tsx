import { ServerCommandHandler } from "../../types/ServerCommandHandler";

export const portscanCommand: ServerCommandHandler = ({
  args,
  addMessage,
  addEvent,
}) => {
  const target = args[0];
  if (!target) {
    addMessage("usage: portscan [ip]");
    return;
  }
  addEvent({ type: "StartPortscan", target });
};
