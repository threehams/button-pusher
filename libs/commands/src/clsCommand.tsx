import { CommandHandler } from "./CommandHandler";

export const clsCommand: CommandHandler = ({ clearHistory }) => {
  clearHistory();
};
