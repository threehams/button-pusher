import { range } from "lodash";

export const breakRange = (ipRange: string) => {
  const length = ipRange.split(".").length;
  if (length >= 4) {
    return [ipRange];
  }
  return range(1, 255).map((part) => {
    return `${ipRange}.${part}`;
  });
};
