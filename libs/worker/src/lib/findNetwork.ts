// import seedrandom from "seedrandom";
import { breakRange } from "./breakRange";

export const findNetwork = (range: string) => {
  // const random = seedrandom(range);
  const ips = breakRange(range);
  return ips;
};

// https://www.youtube.com/watch?v=kHA-Mtkuzno
//
// Level 1
//
// As an end user, first connection is to ISP "Point of Presence"
// Contains the Recursive Name Server
// Gateway
// Private network, PoP (level 1) cannot connect to other level 1
//
// Level 2
// Fiber
// Connects PoPs for the same provider

// Level 3
// Internet Exchange Points
// Fiber cables connect between ISPs

// Level 4
// Undersea cables
