import { CommandHandler } from "./CommandHandler";
import table from "markdown-table";
import { format } from "date-fns";
import { File, Folder } from "@botnet/messages";
import { FILESYSTEM_ROOT, rsplit } from "@botnet/utils";

const displayName = (file: File | Folder) => {
  if (file.type === "Folder") {
    return `${file.name}/`;
  }
  if (file.executable) {
    return `${file.name}*`;
  }
  return file.name;
};

export const lsCommand: CommandHandler = ({
  addMessage,
  files: allFiles,
  state,
  args,
}) => {
  if (!allFiles) {
    return;
  }

  const files = allFiles.filter((file) => file.path === state.cwd);
  if (args[0]?.includes("a")) {
    const current = allFiles.find((file) => {
      if (state.cwd === FILESYSTEM_ROOT) {
        return file.name === FILESYSTEM_ROOT;
      }
      const [path, folder] = rsplit(state.cwd, "/", 1);
      return file.path === path && folder === file.name;
    })!;
    const parent = allFiles.find((file) => {
      if (state.cwd === FILESYSTEM_ROOT) {
        return file.name === FILESYSTEM_ROOT;
      }
      const [path, folder] = rsplit(state.cwd, "/", 2);
      return file.path === path && folder === file.name;
    })!;
    files.unshift({
      ...parent,
      name: "..",
    });
    files.unshift({
      ...current,
      name: ".",
    });
  }

  if (args[0]?.includes("l")) {
    addMessage(
      table(
        files.map((file) => {
          const updatedAt = new Date(file.updatedAt);
          const yearFormat =
            updatedAt.getFullYear() === new Date().getFullYear()
              ? "hh:mm"
              : "yyyy";
          return [
            file.owner,
            file.size.toString(),
            format(updatedAt, `MMM dd ${yearFormat}`),
            displayName(file),
          ];
        }),
      ),
    );
    return;
  }
  addMessage(files.map((file) => `- ${displayName(file)}`).join("\n"));
};
