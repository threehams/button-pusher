import { CommandHandler } from "./CommandHandler";

export const bgCommand: CommandHandler = ({ setOpenProcessId }) => {
  setOpenProcessId(null);
};
