import { useMemo } from "react";
import { Filesystem, Folder, File } from "@botnet/messages";
import { joinPath } from "@botnet/utils";

export const useFiles = (filesystem: Filesystem | undefined) => {
  return useMemo(() => {
    if (!filesystem) {
      return undefined;
    }
    const { root, contents } = filesystem;

    const itemMap = Object.fromEntries(
      contents.map((item) => {
        return [item.id, item];
      }),
    );

    const addUiData = (
      id: string,
      indent = 0,
      cwd = "",
    ): Array<(File | Folder) & { indent: number; path: string }> => {
      const item = itemMap[id];
      const newItem = {
        ...item,
        indent,
        path: cwd,
      };
      if (newItem.type === "File" || !newItem.contents.length) {
        return [newItem];
      }
      return [
        newItem,
        ...newItem.contents.flatMap((child) =>
          addUiData(
            child,
            indent + 1,
            cwd ? joinPath(cwd, newItem.name) : newItem.name,
          ),
        ),
      ];
    };

    return addUiData(root);
  }, [filesystem]);
};
