import { Record, String, Union, Literal, Static } from "runtypes";

export const Email = Record({
  id: String,
  // From address, ex: Hacker <hacker@example.com>
  from: String,
  // To address, may not be the player! ex: You <you@example.com>
  to: String,
  // true if read, false if not
  status: Union(Literal("Read"), Literal("Unread"), Literal("Archived")),
  // Single-line summary of message
  subject: String,
  // Text of the message, can include Markdown
  body: String,
});
export type Email = Static<typeof Email>;
