import { range, zip } from "lodash";
import { alea as seedrandom } from "seedrandom";
import { breakRange } from "./breakRange";

const SEED = "42";
type Connection = {
  ip: string;
  type: "workstation";
  latency: number;
};

export const findPath = (
  source: string,
  target: string,
): Connection[] | undefined => {
  if (source === target) {
    return [{ ip: target, type: "workstation", latency: 0 }];
  }
  const upPath: Connection[] = [];
  const downPath: Connection[] = [];
  const up = traverse(source);
  const down = traverse(target);
  if (!up || !down) {
    return undefined;
  }
  let last: Connection | undefined;
  zip(up, down).map(([upConnection, downConnection]) => {
    if (upConnection?.ip === downConnection?.ip) {
      last = upConnection;
    } else {
      if (last) {
        upPath.push(last);
      }
      if (upConnection) {
        upPath.push(upConnection);
      }
      if (downConnection) {
        downPath.push(downConnection);
      }
      last = undefined;
    }
  });
  return upPath.reverse().concat(downPath);
};

const traverse = (
  target: string,
  assigned?: string,
  ranges: string[] = DEFAULT_RANGE,
  path: Connection[] = [],
): Connection[] | undefined => {
  const depth = path.length;
  const random = seedrandom(`${SEED}${assigned}`);
  if (targetMatchesBlock(assigned, target)) {
    if (path[path.length - 1]?.ip === target) {
      return path;
    }
    return [
      ...path,
      { ip: target, type: "workstation", latency: latencyFor(random, depth) },
    ];
  }
  const availableBlocks = ranges.flatMap((block) => {
    if (random() < 0.6) {
      return block;
    }
    return breakRange(block);
  });
  shuffle(availableBlocks, SEED);
  const maxConnections = Math.floor(random() * availableBlocks.length);
  const connectionCount = Math.min(maxConnections + 1, availableBlocks.length);
  const nodes: Array<[string, string[]]> = [];

  let foundIndex: number | undefined;
  range(0, connectionCount).forEach((index) => {
    const block = availableBlocks[index];
    if (!foundIndex && targetMatchesBlock(block, target)) {
      foundIndex = index;
    }
    nodes.push([block, []]);
  });
  range(connectionCount, availableBlocks.length).forEach((index) => {
    const bucket = Math.floor(random() * connectionCount);
    if (foundIndex !== undefined && foundIndex !== bucket) {
      return;
    }
    const block = availableBlocks[index];
    if (!foundIndex && targetMatchesBlock(block, target)) {
      foundIndex = bucket;
    }
    nodes[bucket][1].push(block);
  });
  if (foundIndex === undefined) {
    // IP doesn't exist
    return undefined;
  }
  const next = nodes[foundIndex];
  return traverse(target, next[0], next[1], [
    ...path,
    {
      ip: findGateway(next[0]),
      type: "workstation",
      latency: latencyFor(random, depth),
    },
  ]);
};

const latencyFor = (random: () => number, depth: number) => {
  return randomInt(random, depth, Math.floor(10 * (1 / (depth + 0.5) ** 1.5)));
};

const randomInt = (random: () => number, low: number, high: number) => {
  return Math.floor(random() * (high + low)) + low;
};

const shuffle = <T>(arr: T[], seed: string) => {
  const random = seedrandom(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * i);
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
};

const targetMatchesBlock = (block: string | undefined, target: string) => {
  if (!block) {
    return false;
  }
  return target.startsWith(block) && target[block.length] === ".";
};

const DEFAULT_RANGE = range(0, 10)
  .concat(range(11, 254))
  .map((num) => num.toString());

const findGateway = (ipRange: string) => {
  const random = seedrandom(`${ipRange}${SEED}`);
  const length = ipRange.split(".").length + 1;
  const suffix = range(0, 5 - length)
    .map(() => {
      return Math.floor(random() * 253) + 1;
    })
    .join(".");
  return [ipRange, suffix].join(".");
};
