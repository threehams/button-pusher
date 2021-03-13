import { Literal } from "runtypes";

export const getObjectMap = <T extends string, U>(
  union: { alternatives: Literal<T>[] },
  value: U,
) => {
  return union.alternatives.reduce(
    (acc, val) => {
      (acc as any)[val.value] = value;
      return acc;
    },
    {} as {
      [K in T]: U;
    },
  );
};
