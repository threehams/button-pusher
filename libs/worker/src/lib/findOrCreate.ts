export const findOrCreate = <T>(list: T[], newItem: T, idField: keyof T) => {
  const existing = list.find((item) => item[idField] === newItem[idField]);
  if (existing) {
    return existing;
  }
  list.push(newItem);
  return newItem;
};
