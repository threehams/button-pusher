import { bgCommand } from "./bgCommand";
import { cdCommand } from "./cdCommand";
import { clsCommand } from "./clsCommand";
import { fgCommand } from "./fgCommand";
import { helpCommand } from "./helpCommand";
import { lsCommand } from "./lsCommand";
import { mailCommand } from "./mailCommand";
import { psCommand } from "./psCommand";
import { CommandHandler } from "./CommandHandler";

export * from "./CommandContext";
export * from "./useFiles";
export * from "./useLocalCommands";

export const commands: { [key: string]: CommandHandler | undefined } = {
  background: bgCommand,
  bg: bgCommand,
  cd: cdCommand,
  cls: clsCommand,
  dir: lsCommand,
  fg: fgCommand,
  foreground: fgCommand,
  help: helpCommand,
  ls: lsCommand,
  mail: mailCommand,
  ps: psCommand,
  process: psCommand,
};
