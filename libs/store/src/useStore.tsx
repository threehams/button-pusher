import { items as availableItems } from "@botnet/data";
import { Container } from "@botnet/messages";
import { useCallback, useMemo } from "react";
import { useImmer } from "use-immer";
import { v4 as uuid } from "uuid";
import { State } from "./State";

const STARTING_CONTAINER: Container = {
  id: uuid(),
  height: 3,
  width: 3,
  slotIds: [],
};

export type SetHeldItem = (itemId: string) => void;
export type MoveSlot = (options: {
  slotId: string;
  x: number;
  y: number;
  containerId: string;
}) => void;
export type AddSlot = (options: {
  itemId: string;
  x: number;
  y: number;
  containerId: string;
}) => void;

/**
 * Set up local state to hold onto messages received from the server.
 *
 * Concerns:
 * - Listen to incoming messages and set state.
 * - Provide functions to other hooks to modify state.
 *
 */
export const useStore = () => {
  const [state, setState] = useImmer<State>(() => ({
    messages: [],
    containerIds: [STARTING_CONTAINER.id],
    containerMap: { [STARTING_CONTAINER.id]: STARTING_CONTAINER },
    currentContainerId: STARTING_CONTAINER.id,
    itemMap: Object.fromEntries(availableItems.map((item) => [item.id, item])),
    slotMap: {},
    heldItemId: undefined,
  }));

  const clearHistory = useCallback(() => {
    setState((draft) => {
      draft.messages = [];
    });
  }, [setState]);
  const addSlot: AddSlot = useCallback(
    ({ itemId, x, y, containerId }) => {
      const slot = {
        id: uuid(),
        x,
        y,
        itemId,
        containerId,
      };
      // need to check overlaps here
      setState((draft) => {
        draft.slotMap[slot.id] = slot;
        draft.containerMap[containerId].slotIds.push(slot.id);
        draft.heldItemId = undefined;
      });
    },
    [setState],
  );
  const setHeldItem: SetHeldItem = useCallback(
    (itemId) => {
      setState((draft) => {
        draft.heldItemId = itemId;
      });
    },
    [setState],
  );
  const moveSlot: MoveSlot = useCallback(
    ({ slotId, x, y, containerId }) => {
      // need to check overlaps here
      setState((draft) => {
        const slot = draft.slotMap[slotId];
        const currentContainerId = slot.containerId;
        if (currentContainerId !== containerId) {
          draft.containerMap[currentContainerId].slotIds = draft.containerMap[
            containerId
          ].slotIds.filter((currentSlotId) => currentSlotId === slotId);
          draft.containerMap[containerId].slotIds.push(slot.id);
          slot.x = x;
          slot.y = y;
        }
      });
    },
    [setState],
  );
  const inventory = useMemo(() => {
    if (!state.currentContainerId) {
      return undefined;
    }
    const container = state.containerMap[state.currentContainerId];
    return {
      ...container,
      slots: container.slotIds.map((slotId) => {
        const slot = state.slotMap[slotId];
        return {
          ...slot,
          item: state.itemMap[slot.itemId],
        };
      }),
    };
  }, [
    state.containerMap,
    state.currentContainerId,
    state.itemMap,
    state.slotMap,
  ]);
  const heldItem = useMemo(() => {
    if (!state.heldItemId) {
      return undefined;
    }
    return state.itemMap[state.heldItemId];
  }, [state.heldItemId, state.itemMap]);

  const items = useMemo(() => {
    return Object.values(state.itemMap);
  }, [state.itemMap]);

  return {
    addSlot,
    setHeldItem,
    moveSlot,
    clearHistory,
    inventory,
    heldItem,
    setState,
    items,
  };
};
