import { Static, Dictionary } from "runtypes";
import { Container } from "./Container";

export const ContainerMap = Dictionary(Container);
export type ContainerMap = Static<typeof ContainerMap>;
