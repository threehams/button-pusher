import React, { useState, useEffect } from "react";
import { Box, Link, Markdown } from "@botnet/ui";
import { Device } from "@botnet/messages";

type Category = "install";
type DevicesPanelProps = {
  devices: Device[];
};
export const DevicesPanel = ({ devices }: DevicesPanelProps) => {
  const [currentIp, setCurrentIp] = useState<string | null>(null);
  const device = devices.find((dev) => dev.ip === currentIp);

  if (device) {
    return (
      <Box paddingBottom={1}>
        <Box marginBottom={1}>Detail</Box>
        <div>{device.ip}</div>
        <Box paddingLeft={1}>
          <DeviceDetail
            device={device}
            onClose={() => {
              setCurrentIp(null);
            }}
          />
        </Box>
      </Box>
    );
  }
  return (
    <Box paddingBottom={1}>
      <Box marginBottom={1}>Known Devices</Box>
      {devices.map((dev) => {
        return (
          <Link
            key={dev.ip}
            block
            href={dev.ip}
            data-test="knownIp"
            onClick={() => {
              setCurrentIp(dev.ip);
            }}
          >
            {dev.ip}
          </Link>
        );
      })}
    </Box>
  );
};

type DeviceDetailProps = {
  device: Device;
  onClose: () => void;
};
const DeviceDetail = ({ device, onClose }: DeviceDetailProps) => {
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const commands = {
    main: device.commands.filter((command) => {
      return baseCommand(command) !== "install";
    }),
    install: device.commands.filter((command) => {
      return baseCommand(command) === "install";
    }),
  };
  const onBack = () => {
    if (currentCategory) {
      setCurrentCategory(null);
    } else {
      onClose();
    }
  };

  useEffect(() => {
    if (currentCategory === "install" && !commands.install.length) {
      setCurrentCategory(null);
    }
  }, [commands.install.length, currentCategory]);

  if (currentCategory) {
    return (
      <>
        {commands[currentCategory].map((command) => {
          return (
            <div key={command}>
              <Markdown>{command}</Markdown>
            </div>
          );
        })}
        <Link block href="back" onClick={onBack}>
          Back
        </Link>
      </>
    );
  }

  return (
    <>
      {commands.main.map((command) => {
        return (
          <div key={command}>
            <Markdown>{command}</Markdown>
          </div>
        );
      })}
      {!!commands.install.length && (
        <Link
          block
          href="install"
          onClick={() => {
            setCurrentCategory("install");
          }}
        >
          Install Malware
        </Link>
      )}
      <Link block href="back" onClick={onClose}>
        Back
      </Link>
    </>
  );
};

// copy/paste from https://github.com/probablyup/markdown-to-jsx/blob/master/index.js
// pfffffft this is awful, but it's quicker than changing the backend response!
const linkRegex = /\[(.+)\]\(([^ ]+?)( "(.+)")?\)/;

const baseCommand = (markdown: string) => {
  const match = linkRegex.exec(markdown);
  if (!match) {
    throw new Error(
      `Received a device command with no valid Markdown link: ${markdown}`,
    );
  }
  return match[2].split("|")[0];
};
