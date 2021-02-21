import { useImmer } from "use-immer";
import { State } from "./State";
import { useWorker } from "@botnet/worker";
import { useEffect, useCallback, useRef } from "react";
import { MailProcess } from "@botnet/messages";
import { FILESYSTEM_ROOT } from "@botnet/utils";

/**
 * Set up local state to hold onto messages received from the server.
 *
 * Concerns:
 * - Listen to incoming messages and set state.
 * - Provide functions to other hooks to modify state.
 *
 */
export const useStore = (username: string) => {
  const initial = useRef<boolean>(false);
  const [state, setState] = useImmer<State>({
    messages: [],
    devices: [],
    resources: null,
    commandHistory: [],
    processes: [],
    location: "local",
    emails: [],
    filesystems: {},
    cwd: FILESYSTEM_ROOT,
  });
  const { lastMessage, ready, sendMessage } = useWorker();

  useEffect(() => {
    if (!username) {
      return;
    }

    if (ready) {
      if (!initial.current) {
        setState((draft) => {
          draft.messages.push(
            `Authenticating with public key "imported-133+ssh-key"`,
          );
          draft.messages.push(`Logged in as ${username}`);
          draft.messages.push(
            `Type or click [help](help) for a list of commands.`,
          );
        });
      }
      initial.current = true;
    }
  }, [ready, setState, sendMessage, username]);

  useEffect(() => {
    if (!lastMessage) {
      return;
    }
    if (lastMessage.update === "Terminal") {
      setState((draft) => {
        draft.messages.push(lastMessage.payload.message);
      });
    }
    if (lastMessage.update === "Player") {
      setState((draft) => {
        draft.location = lastMessage.payload.location;
      });
    }
    if (lastMessage.update === "Devices") {
      setState((draft) => {
        draft.devices = lastMessage.payload.devices;
      });
    }
    if (lastMessage.update === "Emails") {
      setState((draft) => {
        draft.emails = lastMessage.payload.emails;
      });
    }
    if (lastMessage.update === "Filesystem") {
      setState((draft) => {
        draft.filesystems[lastMessage.payload.ip] = lastMessage.payload;
      });
    }
    if (
      lastMessage.update === "PortscanProcess" ||
      lastMessage.update === "SshCrackProcess" ||
      lastMessage.update === "InfostealerProcess"
    ) {
      const newProcess = lastMessage.payload;
      setState((draft) => {
        const index = draft.processes.findIndex(
          (process) => process.id === newProcess.id,
        );
        if (index === -1) {
          draft.processes.push(newProcess);
        } else {
          draft.processes[index] = newProcess;
        }
      });
    }
  }, [lastMessage, setState]);

  // This used to do more...
  const location = state.location;
  const sendCommand = sendMessage;

  const clearHistory = useCallback(() => {
    setState((draft) => {
      draft.messages = [];
    });
  }, [setState]);
  const addMessage = useCallback(
    (message: string) => {
      setState((draft) => {
        draft.messages.push(message);
      });
    },
    [setState],
  );
  const addHistory = useCallback(
    (message: string) => {
      setState((draft) => {
        draft.commandHistory.push(message);
      });
    },
    [setState],
  );
  const startProcess = useCallback(
    (newProcess: MailProcess) => {
      setState((draft) => {
        const index = draft.processes.findIndex(
          (process) => process.id === newProcess.id,
        );
        if (index === -1) {
          draft.processes.push(newProcess);
        } else {
          draft.processes[index] = newProcess;
        }
      });
    },
    [setState],
  );
  const setCwd = useCallback(
    (cwd: string) => {
      setState((draft) => {
        draft.cwd = cwd;
      });
    },
    [setState],
  );

  return {
    addHistory,
    addMessage,
    clearHistory,
    location,
    startProcess,
    ready,
    sendCommand,
    state,
    setState,
    setCwd,
  };
};
