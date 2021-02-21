import { findDevice } from "../../lib/findDevice";
import { findOrCreate } from "../../lib/findOrCreate";
import { findPath } from "../../lib/findPath";
import { System } from "../../types/System";
import { dictionary } from "@botnet/utils";

export const sshCrackSystem = ({ world, addMessage }: System) => {
  const eventsComponent = world.with("Events")[0].components.Events;
  eventsComponent.events.forEach((event) => {
    if (event.type === "StartSshCrack") {
      const player = world.with("Player", "Location", "KnownDevices")[0];
      const sourceIp = event.source ?? player.components.Location.ip;
      const path = findPath(sourceIp, event.target);
      if (!path) {
        addMessage(`brute: no path to destination`);
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
      target.components.SshCrack = {
        lastIndex: 0,
        source: sourceIp,
        type: "SshCrack",
        startedAt: new Date().getTime(),
      };
      findOrCreate(
        player.components.KnownDevices.items,
        { ip: event.target, ports: [] },
        "ip",
      );
    }
  });

  world.with("SshCrack").forEach((entity) => {
    const { source, startedAt, lastIndex } = entity.components.SshCrack;
    const path = findPath(source, entity.id);
    if (!path) {
      entity.components.SshCrack = undefined!;
      addMessage(`portscan: no path to destination`);
      return;
    }
    const deviceConnection = path[path.length - 1];
    const device = findDevice(deviceConnection.ip, deviceConnection.type);
    const latency = path.reduce((sum, node) => {
      return sum + node.latency;
    }, 0);
    const crackTime = latency + 1;
    const newIndex = Math.floor((new Date().getTime() - startedAt) / crackTime);
    if (newIndex !== lastIndex) {
      dictionary
        .filter((word, index) => index > lastIndex && index <= newIndex)
        .forEach((word) => {
          if (word === device.password) {
            const player = world.with("Player", "Location", "KnownDevices")[0];
            const current = findOrCreate(
              player.components.KnownDevices.items,
              { ip: device.ip, ports: [] },
              "ip",
            );
            current.password = word;
            addMessage(`- [+] ${entity.id} - Success: 'user:${word}'`);
          } else {
            addMessage(`- [-] ${entity.id} - Failed: 'user:${word}'`);
          }
        });
    }
    entity.components.SshCrack.lastIndex = newIndex;
    if (newIndex > dictionary.length) {
      entity.components.SshCrack = undefined!;
      addMessage(`done in ${new Date().valueOf() - startedAt}ms`);
    }
  });
};
