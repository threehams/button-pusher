import { CommandHandler } from "./CommandHandler";

const helpText = `Type [help](help) to see this list.

* [portscan](help|portscan) Scan a remote machine for open ports. Once found, ports can be [attacked](help|attacks)
  to gain access.
* [attacks](help|attacks) Gain access to remote machines using exploits or brute-force attacks.
* [install](help|install) Install programs on devices to use their network, CPU, and memory for your benefit.
`;

const installText = `Install programs on remote machines, such as info stealers or crypto miners.

* [infostealer](help|install|infostealer) Logs keystrokes and searches for patterns, such as usernames/passwords
for sites or other machines.
* [miner](help|install|miner) Mines cryptocurrency. Uses up substantial CPU on the device, which can lead to
detection.
`;

export const helpCommand: CommandHandler = ({
  args: [command, subcommand],
  addMessage,
}) => {
  if (!command) {
    addMessage(helpText);
  }

  if (command === "portscan") {
    addMessage(`Scan a remote machine for open ports.
Once you discover a port, select the device and execute an [attack](help|attacks) based on the port.`);
  }

  if (command === "attacks") {
    addMessage(`Attacks are programs which can gain access to remote machines. Once you have access, programs
can be [installed](help|install) to steal information or take advantage of CPU/GPU or network resources.

* SSH (port 22): [sshcrack](help|sshcrack)
* FTP (port 21): [ftpauth](help|ftpauth)
    `);
  }

  if (command === "install") {
    if (!subcommand) {
      addMessage(installText);
    }
    if (subcommand === "infostealer") {
      addMessage(`Logs keystrokes and searches for patterns.`);
    }
    if (subcommand === "miner") {
      addMessage(`Starts up a cryptocurrency miner.`);
    }
    addMessage(`Program ${subcommand} not found.
${installText}`);
  }

  if (command === "sshcrack") {
    addMessage(`Execute a dictionary attack on the given machine. This will use any password dictionaries available;
larger dictionaries have a higher chance of success, but take longer to run. The quality of the dictionary can
have a substantial effect on success rate.

A successful attack allows useful programs to be [installed](help|install).`);
  }
  if (command === "ftpauth") {
    addMessage(`Attempt to gain access to files on the remote machine through a combination of anonymous checks,
anonymous checking and brute-force attacks.

A successful attack allows access to some of all of the filesystem, which
can lead to attacks granting more permissions.`);
  }

  addMessage(`Unknown command: ${command}.
${helpText}`);
};
