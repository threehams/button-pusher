import { findPath } from "../../lib/findPath";
import { System } from "../../types/System";
import { findOrCreate } from "../../lib/findOrCreate";

export const tracerouteSystem = ({ world, addMessage }: System) => {
  const eventsComponent = world.with("Events")[0].components.Events;
  eventsComponent.events.forEach((event) => {
    if (event.type === "StartTraceroute") {
      const player = world.with("Player", "Location", "KnownDevices")[0];
      const sourceIp = event.source ?? player.components.Location.ip;
      const path = findPath(sourceIp, event.target);
      if (!path) {
        addMessage(`traceroute: no path to destination`);
        return;
      }
      const target =
        world.find(event.target) ??
        world.createEntity(event.target, {
          Location: {
            type: "Location",
            ip: event.target,
          },
        });
      target.components.Traceroute = {
        lastPathIndex: 0,
        source: sourceIp,
        type: "Traceroute",
        startedAt: new Date().getTime(),
      };
      findOrCreate(
        player.components.KnownDevices.items,
        {
          ip: event.target,
          ports: [],
        },
        "ip",
      );
      addMessage(`## tracing ${target.id}, max 30 hops`);
    }
  });

  world.with("Traceroute").forEach((entity) => {
    const { source, startedAt, lastPathIndex } = entity.components.Traceroute;
    const path = findPath(source, entity.id);
    if (!path) {
      entity.components.Traceroute = undefined!;
      addMessage(`traceroute: no path to destination`);
      return;
    }

    const totalTime = Math.floor(new Date().getTime() - startedAt);

    let totalLatency = 0;
    let totalIndex = 0;
    const player = world.with("Player", "Location", "KnownDevices")[0];

    for (const node of path) {
      totalLatency += node.latency;
      if (totalLatency + 1000 * (totalIndex + 1) > totalTime) {
        break;
      }
      totalIndex++;
      if (totalIndex > lastPathIndex) {
        addMessage(
          `[${node.ip}](traceroute|${node.ip}) ${totalLatency}ms ${totalLatency}ms ${totalLatency}ms`,
        );
        findOrCreate(
          player.components.KnownDevices.items,
          { ip: node.ip, ports: [] },
          "ip",
        );
      }
    }
    if (totalIndex !== lastPathIndex) {
      entity.components.Traceroute.lastPathIndex = totalIndex;
    }
    if (totalIndex >= path.length) {
      entity.components.Traceroute = undefined!;
      addMessage(`traceroute complete`);
    }
  });
};
