import table from "markdown-table";
import { CommandHandler } from "./CommandHandler";

export const psCommand: CommandHandler = ({ addMessage, state }) => {
  return addMessage(
    table([
      ["ID", "COMMAND"],
      ...state.processes.map((process) => {
        return [process.id, process.command];
      }),
    ]),
  );
};
