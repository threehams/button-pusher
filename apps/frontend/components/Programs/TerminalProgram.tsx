import { Markdown } from "@botnet/ui";
import React, { useEffect } from "react";
import { useSteppedScroll } from "../../hooks/useSteppedScroll";

type TerminalProgramProps = {
  messages: string[];
};
export const TerminalProgram = React.memo(
  ({ messages }: TerminalProgramProps) => {
    const scrollToBottom = useSteppedScroll();

    useEffect(() => {
      scrollToBottom();
    }, [scrollToBottom, messages]);

    return (
      <div data-test="messages">
        {messages.map((message, index) => (
          <div key={index}>
            <Markdown>{message}</Markdown>
          </div>
        ))}
      </div>
    );
  },
);
