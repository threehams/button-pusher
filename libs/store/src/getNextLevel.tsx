const TILE_COST = 25;

export const getNextLevel = (
  container: {
    width: number;
    height: number;
    maxHeight: number;
    maxWidth: number;
  },
  currentCapacity: number,
) => {
  const { width, height, maxWidth, maxHeight } = container;
  let diff;
  let newWidth;
  let newHeight;
  if (width >= maxWidth && height >= maxHeight) {
    return {
      cost: 0,
      width,
      height,
    };
  } else if (width >= maxWidth) {
    diff = width;
    newWidth = width;
    newHeight = height + 1;
  } else if (width >= maxWidth) {
    diff = height;
    newWidth = width + 1;
    newHeight = height;
  } else if (width <= height) {
    diff = height;
    newWidth = width + 1;
    newHeight = height;
  } else {
    diff = width;
    newWidth = width;
    newHeight = height + 1;
  }

  return {
    width: newWidth,
    height: newHeight,
    // scale this better
    cost: Math.floor(
      TILE_COST * (currentCapacity * Math.log(currentCapacity - 13) + diff),
    ),
  };
};
