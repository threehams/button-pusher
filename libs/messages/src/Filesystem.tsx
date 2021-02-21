import {
  Boolean,
  Number,
  Array,
  Union,
  Record,
  String,
  Static,
  Literal,
} from "runtypes";

export const File = Record({
  id: String,
  type: Literal("File"),
  name: String,
  size: Number,
  owner: String,
  updatedAt: String,
  executable: Boolean,
});
export type File = Static<typeof File>;

export const Folder = Record({
  id: String,
  type: Literal("Folder"),
  name: String,
  contents: Array(String),
  size: Literal(0),
  owner: String,
  updatedAt: String,
  executable: Literal(true),
});
export type Folder = Static<typeof Folder>;

export const Filesystem = Record({
  ip: String,
  contents: Array(Union(File, Folder)),
  root: String,
});
export type Filesystem = Static<typeof Filesystem>;
