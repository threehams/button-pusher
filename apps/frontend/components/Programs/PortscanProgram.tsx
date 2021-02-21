import React from "react";
import { format } from "date-fns";
import { PortscanProcess } from "@botnet/messages";
import table from "markdown-table";
import { CommandLink, Markdown } from "@botnet/ui";

type TemplateValues = {
  startDate: Date;
  ip: string;
  latency: number;
  ports: Array<{ name: string; number: number }>;
};
const template = ({ startDate, ip, latency, ports }: TemplateValues) => `
Starting pscan 4.3.3 at ${format(startDate, "yyyy-mm-dd")}  
Scan report for ${ip}  
Host is up (latency ${latency}ms)  

${table([
  ["PORT", "STATE", "SERVICE"],
  ...ports.map((port) => {
    return [`${port.number}/tcp`, "open", port.name];
  }),
])}
`;

const startDate = new Date();

type Props = {
  process: PortscanProcess;
};
export const PortscanProgram = ({ process }: Props) => {
  return (
    <div data-test="portscanProgram">
      <CommandLink marginBottom={1} block href="background">
        Close
      </CommandLink>
      <Markdown>
        {template({
          startDate,
          ip: process.target,
          latency: 27,
          ports: process.ports,
        })}
      </Markdown>
    </div>
  );
};
