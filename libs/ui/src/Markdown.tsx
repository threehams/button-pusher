import React from "react";
import ReactMarkdown from "markdown-to-jsx";
import { CommandLink } from "./CommandLink";
import { Box } from "./Box";

export const SPACE_CHARACTER = new RegExp("\\|", "g");

type MarkdownProps = {
  children: string;
};
export const Markdown = ({ children }: MarkdownProps) => (
  <ReactMarkdown
    options={{
      overrides: {
        a: {
          component: CommandLink,
        },
        div: {
          component: Box,
        },
      },
    }}
  >
    {children}
  </ReactMarkdown>
);
