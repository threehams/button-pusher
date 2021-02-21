import { ecs } from "../lib/ecs";

export type System = {
  world: ReturnType<typeof ecs>;
  addMessage: (message: string) => void;
};
