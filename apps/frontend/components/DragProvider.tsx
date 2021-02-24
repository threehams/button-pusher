import React, { useCallback, useContext, useEffect, useState } from "react";
import { createContext, useMemo } from "react";

type Coords = { x: number; y: number };
type InventoryCoords = { x: number; y: number; containerId: string };
const DragContext = createContext<{
  position: Coords | undefined;
  start: (position: Coords, source: Bounds, item: Item) => void;
  dragging: boolean;
  initialOffset: Bounds | undefined;
  item: Item | undefined;
  sourceOffset: Coords | undefined;
  setDropCoords: (coords: InventoryCoords | undefined) => void;
  dropCoords: InventoryCoords | undefined;
}>(undefined as any);

type Bounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};
type Item = {
  x: number | undefined;
  y: number | undefined;
  width: number;
  height: number;
};

type Props = {
  children: React.ReactNode;
};
export const DragProvider = ({ children }: Props) => {
  const [position, setPosition] = useState<Coords | undefined>();
  const [dragging, setDragging] = useState(false);
  const [item, setItem] = useState<Item | undefined>(undefined);
  const [dropCoords, setDropCoords] = useState<InventoryCoords | undefined>(
    undefined,
  );
  const [initialOffset, setInitialOffset] = useState<Bounds | undefined>(
    undefined,
  );

  const sourceOffset = useMemo(() => {
    if (!position || !initialOffset) {
      return undefined;
    }
    return {
      x: position.x - initialOffset.x,
      y: position.y - initialOffset.y,
    };
  }, [initialOffset, position]);

  const start = useCallback((pos: Coords, src: Bounds, itm: Item) => {
    setItem(itm);
    setPosition(pos);
    setInitialOffset(src);
    setDragging(true);
  }, []);

  const end = useCallback(() => {
    setPosition(undefined);
    setDragging(false);
  }, []);

  const contextValue = useMemo(
    () => ({
      position,
      start,
      dragging,
      initialOffset,
      sourceOffset,
      item,
      setDropCoords,
      dropCoords,
    }),
    [position, start, dragging, initialOffset, sourceOffset, item, dropCoords],
  );

  useEffect(() => {
    const moveHandler = (event: MouseEvent) => {
      if (dragging) {
        setPosition({ x: event.clientX, y: event.clientY });
      }
    };
    const upHandler = () => {
      end();
    };
    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", upHandler);
    return () => {
      document.removeEventListener("mousemove", moveHandler);
      document.removeEventListener("mouseup", upHandler);
    };
  }, [dragging, end]);

  return (
    <DragContext.Provider value={contextValue}>{children}</DragContext.Provider>
  );
};

export const useDrag = (
  onDrop?: (coords: InventoryCoords | undefined) => void,
) => {
  const context = useContext(DragContext);
  const [lastDragging, setLastDragging] = useState(false);
  useEffect(() => {
    if (!onDrop) {
      return;
    }
    if (lastDragging && !context.dragging) {
      onDrop(context.dropCoords);
    }
    if (lastDragging !== context.dragging) {
      setLastDragging(context.dragging);
    }
  }, [context.dragging, context.dropCoords, lastDragging, onDrop]);

  return context;
};
