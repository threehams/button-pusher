import React, { createRef, useContext, useCallback } from "react";
import { css } from "@emotion/react";
import { CommandContext } from "@botnet/commands";
import { useInputFocus } from "../hooks/useInputFocus";
import { FILESYSTEM_ROOT } from "@botnet/utils";
import { Box } from "@botnet/ui";

const CURSOR = "█";

type CommandPromptProps = {
  username: string;
  cwd: string;
  location: string;
};
export const CommandPrompt = ({
  location,
  username,
  cwd,
}: CommandPromptProps) => {
  const { command, setCommand, sendCommand } = useContext(CommandContext);
  const inputRef = createRef<HTMLInputElement>();
  const prompt = username
    ? `${username}@${location}:${cwd.replace(FILESYSTEM_ROOT, "")}$`
    : `username?`;

  const onSubmit = useCallback(() => {
    sendCommand(command);
    setCommand("");
  }, [command, sendCommand, setCommand]);
  useInputFocus(onSubmit, inputRef);

  return (
    <Box
      css={css`
        position: relative;
        width: 100%;
      `}
      data-test="commandPrompt"
    >
      {prompt} {command}
      {CURSOR}
      <input
        aria-label="Enter Command"
        ref={inputRef}
        size={1}
        value={command}
        onChange={(event) => {
          setCommand(event.target.value);
        }}
        type="text"
        css={css`
          opacity: 0.01;
          position: absolute;
          left: 0;
          outline: none;
        `}
      />
    </Box>
  );
};
