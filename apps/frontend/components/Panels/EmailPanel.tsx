import React from "react";
import { Email } from "@botnet/messages";
import { Static } from "runtypes";
import { Box, CommandLink } from "@botnet/ui";

type EmailPanelProps = {
  emails: Array<Static<typeof Email>>;
};
export const EmailPanel = ({ emails }: EmailPanelProps) => {
  const unreadCount = emails.filter((email) => email.status === "Unread")
    .length;
  const text = `(${unreadCount} unread)`;
  return (
    <Box marginBottom={1}>
      Mail <CommandLink href="mail">{text}</CommandLink>
    </Box>
  );
};
