import React, { useState } from "react";
import { Filesystem } from "@botnet/messages";
import { Box, Link, CommandLink } from "@botnet/ui";
import { useSet } from "../../hooks/useSet";
import { useFiles } from "@botnet/commands";

type Props = {
  filesystem: Filesystem;
};
export const FilesystemProgram = ({ filesystem }: Props) => {
  const expanded = useSet<string>([]);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const items = useFiles(filesystem);
  const { contents } = filesystem;

  const currentItem = currentItemId
    ? contents.find((item) => item.id === currentItemId)
    : null;
  if (currentItem) {
    return (
      <div>
        <Link
          block
          href="back"
          onClick={() => {
            setCurrentItemId(null);
          }}
        >
          q: back
        </Link>
        <div>{currentItem.name}</div>
      </div>
    );
  }

  if (!items) {
    return (
      <div>
        <CommandLink href="background">q: quit</CommandLink>
      </div>
    );
  }

  return (
    <div>
      {items.map((item) => {
        if (item.type === "Folder") {
          return (
            <Box key={item.id} paddingLeft={item.indent}>
              <Link
                href="expand"
                onClick={() => {
                  expanded.toggle(item.id);
                }}
              >
                {expanded.has(item.id) ? "˄" : "˅"} {item.name}
              </Link>
            </Box>
          );
        }
        return (
          <Box key={item.id} paddingLeft={item.indent}>
            <Link
              href="view"
              onClick={() => {
                setCurrentItemId(item.id);
              }}
            >
              {item.name}
            </Link>
          </Box>
        );
      })}
    </div>
  );
};
