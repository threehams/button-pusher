import { findDevice } from "../../lib/findDevice";
import { findPath } from "../../lib/findPath";
import { System } from "../../types/System";

export const sshSystem = ({ world, addMessage }: System) => {
  const eventsComponent = world.with("Events")[0].components.Events;
  eventsComponent.events.forEach((event) => {
    if (event.type === "StartSshSession") {
      const player = world.with("Player", "Location", "KnownDevices")[0];
      const path = findPath(player.components.Location.ip, event.target);
      if (!path) {
        addMessage(`ssh: no route to host: ${event.target}`);
        return;
      }
      const device = findDevice(
        path[path.length - 1].ip,
        path[path.length - 1].type,
      );
      const knownDevice = player.components.KnownDevices.items.find(
        (known) => known.ip === event.target,
      );
      if (knownDevice?.password !== device.password) {
        addMessage(`ssh: access denied for host: ${event.target}`);
        return;
      }
      addMessage(`ssh: ${event.target}: logged in as user`);
      player.components.Location.ip = event.target;
    }
  });
};
