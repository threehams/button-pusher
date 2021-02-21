export const rsplit = <T extends string>(
  text: T,
  separator: string,
  limit?: number,
) => {
  const split = text.split(separator);
  return limit
    ? [split.slice(0, -limit).join(separator)].concat(split.slice(-limit))
    : split;
};
