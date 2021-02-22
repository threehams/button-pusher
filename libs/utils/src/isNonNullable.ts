export const isNonNullable = <T extends unknown>(
  item: T,
): item is NonNullable<T> => {
  return item !== null && item !== undefined;
};
