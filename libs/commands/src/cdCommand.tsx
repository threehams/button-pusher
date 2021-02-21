import { joinPath, splitPath, FILESYSTEM_ROOT } from "@botnet/utils";
import { CommandHandler } from "./CommandHandler";

export const cdCommand: CommandHandler = ({
  addMessage,
  args,
  command,
  files,
  setCwd,
  state,
}) => {
  const rawPath = args[0];
  if (!rawPath) {
    return;
  }

  if (rawPath === "/") {
    setCwd(FILESYSTEM_ROOT);
    return;
  }

  const path = joinPath(rawPath);
  if (path === ".") {
    return;
  }

  if (path === "..") {
    if (state.cwd === FILESYSTEM_ROOT) {
      return;
    }
    const newPath = splitPath(state.cwd).slice(0, -1).join("/");
    setCwd(`${newPath}`);
    return;
  }

  const newPath = path.startsWith("/")
    ? joinPath(FILESYSTEM_ROOT, path)
    : joinPath(state.cwd, path);
  if (
    newPath === "/" ||
    files?.find((file) => {
      return (
        file.type === "Folder" && newPath === joinPath(file.path, file.name)
      );
    })
  ) {
    setCwd(newPath);
  } else {
    addMessage(`${command}: ${path}: directory not found`);
  }
};
