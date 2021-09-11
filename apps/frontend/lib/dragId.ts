type DragItem = {
  x: number;
  y: number;
  width: number;
  height: number;
  slotId: string;
  containerId: string;
};

export const serializeDragId = ({
  x,
  y,
  width,
  height,
  slotId,
  containerId,
}: DragItem) => {
  return `${x};${y};${width};${height};${slotId};${containerId}`;
};

export const deserializeDragId = (id: string) => {
  const [x, y, width, height, slotId, containerId] = id.split(";");
  return {
    x: Number(x),
    y: Number(y),
    width: Number(width),
    height: Number(height),
    slotId,
    containerId,
  };
};
