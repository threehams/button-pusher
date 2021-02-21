import React, { useEffect } from "react";
import { useSteppedScroll } from "../../hooks/useSteppedScroll";
import { InfostealerProcess, Login } from "@botnet/messages";
import { CommandLink, Markdown } from "@botnet/ui";

type TemplateValues = {
  logins: Login[];
  error: string | null;
};
const template = ({ logins, error }: TemplateValues): string => `
seagull running...

${logins
  .map(({ username, password }) => {
    if (username && password) {
      return `- login found: "${username}" / "${password}"`;
    }
    if (username) {
      return `- username found: "${username}"`;
    }
    if (password) {
      return `- password found: "${password}"`;
    }
  })
  .filter(Boolean)
  .join("\n  ")}
  ${error ? "[process terminated]" : ""}
`;

type Props = {
  process: InfostealerProcess;
};
export const InfostealerProgram = ({ process }: Props) => {
  const scrollToBottom = useSteppedScroll();

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom, process.logins]);

  return (
    <div data-test="infostealerProgram">
      <CommandLink marginBottom={1} block href="background">
        Close
      </CommandLink>
      <Markdown>
        {template({
          logins: process.logins,
          error: process.error,
        })}
      </Markdown>
    </div>
  );
};
