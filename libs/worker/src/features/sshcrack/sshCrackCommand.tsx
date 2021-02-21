import { ServerCommandHandler } from "../../types/ServerCommandHandler";

export const sshCrackCommand: ServerCommandHandler = ({
  args,
  addMessage,
  addEvent,
}) => {
  const target = args[0];
  if (!target) {
    addMessage("usage: sshcrack [ip]");
    return;
  }
  addEvent({ type: "StartSshCrack", target });
};
