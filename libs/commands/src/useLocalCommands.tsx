import { useCallback } from "react";
import { MailProcess } from "@botnet/messages";
import { useFiles } from "./useFiles";
import { commands } from "@botnet/commands";
import { State } from "@botnet/store";
import { FILESYSTEM_ROOT } from "@botnet/utils";

type UseLocalCommands = {
  addHistory: (command: string) => void;
  clearHistory: () => void;
  addMessage: (message: string) => void;
  sendCommand: (command: string) => void;
  setCwd: (cwd: string) => void;
  setOpenProcessId: (processId: string | null) => void;
  startProcess: (process: MailProcess) => void;
  state: State;
  username: string;
  location: string;
};
export const useLocalCommands = (props: UseLocalCommands) => {
  const {
    username,
    state,
    location,
    addMessage,
    addHistory,
    sendCommand: sendCommandProp,
  } = props;
  const files = useFiles(state.filesystems["8.8.8.8"]);
  const prompt = `${username}@${location}:${state.cwd.replace(
    FILESYSTEM_ROOT,
    "",
  )}$`;

  const sendCommand = useCallback(
    (fullCommand: string): void => {
      const [command, ...args] = fullCommand.split(/ +/);
      if (!command) {
        addMessage(prompt);
        return;
      }
      const commandProps = {
        command,
        args,
        files,
        ...props,
      };

      addMessage(`${prompt} ${fullCommand}`);
      addHistory(fullCommand);
      if (commands[command]) {
        commands[command]?.(commandProps);
      } else {
        sendCommandProp(fullCommand);
      }
    },
    [addHistory, addMessage, files, prompt, props, sendCommandProp],
  );
  return sendCommand;
};
