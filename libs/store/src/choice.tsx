export const choice = <T extends unknown>(arr: T[]): T => {
  console.log(arr.length);
  return arr[Math.floor(Math.random() * arr.length)];
};
