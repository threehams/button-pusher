import React from "react";
import { useContext } from "react";
import { CommandContext } from "@botnet/commands";
import { SPACE_CHARACTER } from "./Markdown";
import { Anchor } from "./Anchor";
import { css } from "@emotion/react";
import { SpaceProps } from "./spaceProps";

type CommandLinkProps = {
  children: React.ReactNode;
  href: string;
  highlightFocus?: boolean;
  block?: boolean;
} & SpaceProps;
export const CommandLink = ({
  block,
  href: hrefProp,
  children,
  ...rest
}: CommandLinkProps) => {
  const { sendCommand } = useContext(CommandContext);
  const href = hrefProp.replaceAll(SPACE_CHARACTER, " ");
  return (
    <Anchor
      css={css`
        display: ${block ? "block" : "inline-block"};
      `}
      href={href}
      onClick={(event) => {
        event.preventDefault();
        event.currentTarget.blur();
        sendCommand(href);
      }}
      {...rest}
    >
      {children}
    </Anchor>
  );
};
