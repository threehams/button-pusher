export const choice = <T extends unknown>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};
