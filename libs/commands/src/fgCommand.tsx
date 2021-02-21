import { CommandHandler } from "./CommandHandler";

export const fgCommand: CommandHandler = ({
  command,
  args,
  state,
  addMessage,
  setOpenProcessId,
}) => {
  const id = args[0];
  if (!id) {
    addMessage(`${command}: requires a process id`);
  } else {
    const process = state.processes.find((proc) => proc.id === id);
    if (process) {
      setOpenProcessId(process.id);
    } else {
      addMessage(`${command}: process id ${id} not found`);
    }
  }
};
