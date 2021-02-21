import { Message } from "@botnet/messages";
import { Component } from "./components";
import { clearEventsSystem } from "./features/events";
import { portscanCommand, portscanSystem } from "./features/portscan";
import { sshCommand, sshSystem } from "./features/ssh";
import { sshCrackCommand, sshCrackSystem } from "./features/sshcrack";
import { tracerouteCommand, tracerouteSystem } from "./features/traceroute";
import { ecs } from "./lib/ecs";

const worker = (self as unknown) as Worker;

const world = ecs([]);
world.createEntity(undefined, { Events: { type: "Events", events: [] } });
world.createEntity(undefined, {
  Player: { type: "Player", homeIp: "199.201.159.1" },
  Location: {
    ip: "199.201.159.1",
    type: "Location",
  },
  KnownDevices: {
    items: [
      { ip: "199.201.159.1", ports: [] },
      {
        ip: "8.8.8.8",
        ports: [],
      },
    ],
    type: "KnownDevices",
  },
});
const systems = [
  portscanSystem,
  sshCrackSystem,
  sshSystem,
  tracerouteSystem,
  clearEventsSystem,
];

worker.addEventListener("message", (event: { data: string }) => {
  const messages: string[] = [];
  const addMessage = (message: string) => {
    messages.push(message);
  };
  const addEvent = (component: Component) => {
    const eventEntity = world.with("Events")[0];
    const eventComponent = eventEntity.components.Events;
    eventComponent.events.push(component);
  };

  const [command, ...args] = event.data.split(" ");
  switch (command) {
    case "traceroute": {
      tracerouteCommand({ args, command, addMessage, addEvent });
      break;
    }
    case "portscan": {
      portscanCommand({ args, command, addMessage, addEvent });
      break;
    }
    case "sshcrack": {
      sshCrackCommand({ args, command, addMessage, addEvent });
      break;
    }
    case "ssh": {
      sshCommand({ args, command, addMessage, addEvent });
      break;
    }
    default: {
      messages.push(`${command}: command not found`);
    }
  }

  if (messages.length) {
    const message: Message = {
      update: "Terminal",
      payload: {
        message: messages.join("\n"),
      },
    };
    worker.postMessage(message);
  }
});

const isTruthy = <T>(
  item: T,
): item is Exclude<T, false | 0 | null | undefined | ""> => {
  return !!item;
};

const INTERVAL = 250;

let last = new Date().valueOf();

const gameLoop = () => {
  if (new Date().valueOf() - last < INTERVAL) {
    requestAnimationFrame(gameLoop);
    return;
  }
  last = new Date().valueOf();
  const messages: string[] = [];
  const addMessage = (message: string) => {
    messages.push(message);
  };

  systems.forEach((system) => {
    system({ world, addMessage });
  });

  if (messages.length) {
    const message: Message = {
      update: "Terminal",
      payload: {
        message: messages.join("\n"),
      },
    };
    worker.postMessage(message);
  }

  const player = world.with("Player", "Location", "KnownDevices")[0];
  const updateDevicesMessage: Message = {
    update: "Devices",
    payload: {
      devices: player.components.KnownDevices.items.map((device) => {
        return {
          ip: device.ip,
          commands: [
            `[portscan](portscan|${device.ip})`,
            `[traceroute](traceroute|${device.ip})`,
            device.ports.includes(22) &&
              !device.password &&
              `[sshcrack](sshcrack|${device.ip})`,
            device.password &&
              player.components.Location.ip !== device.ip &&
              `[ssh](ssh|${device.ip})`,
          ].filter(isTruthy),
        };
      }),
    },
  };
  worker.postMessage(updateDevicesMessage);
  const playerMessage: Message = {
    update: "Player",
    payload: {
      location: player.components.Location.ip,
    },
  };
  worker.postMessage(playerMessage);

  requestAnimationFrame(gameLoop);
};

gameLoop();
