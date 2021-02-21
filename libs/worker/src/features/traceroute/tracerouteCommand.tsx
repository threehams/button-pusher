import { ServerCommandHandler } from "../../types/ServerCommandHandler";

export const tracerouteCommand: ServerCommandHandler = ({
  args,
  addMessage,
  addEvent,
}) => {
  const target = args[0];
  if (!target) {
    addMessage("usage: traceroute [ip]");
    return;
  }
  addEvent({ type: "StartTraceroute", target });
};
