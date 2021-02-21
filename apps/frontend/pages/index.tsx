import { css, useTheme } from "@emotion/react";
import React, { useMemo, useState } from "react";
import {
  CommandPrompt,
  DevicesPanel,
  TerminalProgram,
  ProcessesPanel,
  ResourcesPanel,
  Status,
  UsernamePrompt,
} from "../components";
import { CommandContext, useLocalCommands } from "@botnet/commands";
import { EmailPanel } from "../components/Panels/EmailPanel";
import { TerminalOverlay } from "../components/TerminalOverlay";
import { useCommandHistory } from "../hooks/useCommandHistory";
import { useSession } from "../hooks/useSession";
import { useStore } from "@botnet/store";
import { PortscanProgram } from "../components/Programs/PortscanProgram";
import { MailProgram } from "../components/Programs/MailProgram";
import { SshCrackProgram } from "../components/Programs/SshcrackProgram";
import { InfostealerProgram } from "../components/Programs/InfostealerProgram";
import { Box } from "@botnet/ui";

export const Index = () => {
  const [username, setUsername] = useSession();
  const [openProcessId, setOpenProcessId] = useState<string | null>(null);
  const {
    addMessage,
    addHistory,
    clearHistory,
    location,
    ready,
    sendCommand: sendServerCommand,
    state,
    startProcess,
    setCwd,
  } = useStore(username);
  const [command, setCommand] = useState("");
  const { setPrevCommand, setNextCommand } = useCommandHistory(
    state.commandHistory,
    setCommand,
  );
  const sendCommand = useLocalCommands({
    location,
    username,
    startProcess,
    clearHistory,
    sendCommand: sendServerCommand,
    setOpenProcessId,
    addMessage,
    addHistory,
    state,
    setCwd,
  });

  const commandContextValue = useMemo(() => {
    return {
      command,
      setCommand,
      sendCommand,
      setPrevCommand,
      setNextCommand,
    };
  }, [command, sendCommand, setNextCommand, setPrevCommand]);
  const theme = useTheme();
  const openProcess = openProcessId
    ? state.processes.find((proc) => proc.id === openProcessId)
    : undefined;

  return (
    <CommandContext.Provider value={commandContextValue}>
      <TerminalOverlay />
      <Box
        css={css`
          min-height: 100vh;
        `}
      >
        <>
          <Box
            css={css`
              display: inline-block;
              width: ${theme.tileWidth * 24}px;
              position: sticky;
              top: 0;
              vertical-align: top;
            `}
            paddingLeft={2}
            paddingTop={1}
          >
            {!!state.resources && (
              <ResourcesPanel resources={state.resources} />
            )}
            {!!state.devices.length && <DevicesPanel devices={state.devices} />}
            {!!state.emails && <EmailPanel emails={state.emails} />}
            {!!state.processes.length && (
              <ProcessesPanel processes={state.processes} />
            )}
          </Box>
          <Box
            css={css`
              display: inline-block;
              width: calc(100% - ${theme.tileWidth * 24}px);
            `}
            paddingX={1}
            paddingY={1}
          >
            {openProcess?.command === "portscan" && (
              <PortscanProgram process={openProcess} />
            )}
            {openProcess?.command === "sshcrack" && (
              <SshCrackProgram process={openProcess} />
            )}
            {openProcess?.command === "mail" && (
              <MailProgram emails={state.emails} />
            )}
            {openProcess?.command === "infostealer" && (
              <InfostealerProgram process={openProcess} />
            )}
            {!openProcess && (
              <>
                <Status ready={ready} />
                <TerminalProgram messages={state.messages} />
                {username ? (
                  <CommandPrompt
                    username={username}
                    cwd={state.cwd}
                    location={location}
                  />
                ) : (
                  <UsernamePrompt setUsername={setUsername} />
                )}
              </>
            )}
          </Box>
        </>
      </Box>
    </CommandContext.Provider>
  );
};

export default Index;
