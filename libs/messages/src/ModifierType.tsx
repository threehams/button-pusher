import { Static, Literal, Union } from "runtypes";

export const ModifierType = Union(Literal("PREFIX"), Literal("SUFFIX"));
export type ModifierType = Static<typeof ModifierType>;
