import React from "react";
import { SPACE_CHARACTER } from "./Markdown";
import { Anchor } from "./Anchor";
import { SpaceProps } from "./spaceProps";

type LinkProps = {
  children: React.ReactNode;
  href: string;
  onClick: React.MouseEventHandler;
  highlightFocus?: boolean;
  block?: boolean;
} & SpaceProps;
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href: hrefProp, onClick, children, block, ...rest }, ref) => {
    const href = hrefProp.replaceAll(SPACE_CHARACTER, " ");
    return (
      <Anchor
        ref={ref}
        display={block ? "block" : "inline-block"}
        href={href}
        onClick={(event) => {
          event.preventDefault();
          onClick(event);
        }}
        {...rest}
      >
        {children}
      </Anchor>
    );
  },
);
