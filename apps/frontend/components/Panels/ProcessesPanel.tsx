import React from "react";
import { Box, CommandLink } from "@botnet/ui";
import { Process } from "@botnet/messages";

type ProcessesPanelProps = {
  processes: Process[];
};
export const ProcessesPanel = ({ processes }: ProcessesPanelProps) => {
  return (
    <div>
      <Box>Processes</Box>
      {processes.map((process) => {
        const progress =
          "progress" in process && process.progress != null
            ? ` (${process.progress}%)`
            : "";
        return (
          <CommandLink
            block
            href={`foreground ${process.id}`}
            key={process.command}
          >
            {process.command.split(" ")[0]}
            {progress}
          </CommandLink>
        );
      })}
    </div>
  );
};
