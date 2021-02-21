import React from "react";
import ReactMarkdown from "markdown-to-jsx";
import { Box } from "./Box";

export const SPACE_CHARACTER = new RegExp("\\|", "g");

type MarkdownProps = {
  children: string;
};
export const Markdown = ({ children }: MarkdownProps) => (
  <ReactMarkdown
    options={{
      overrides: {
        div: {
          component: Box,
        },
      },
    }}
  >
    {children}
  </ReactMarkdown>
);
