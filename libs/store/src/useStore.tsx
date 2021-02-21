import { useImmer } from "use-immer";
import { State } from "./State";
import { useCallback, useMemo } from "react";
import { Container } from "@botnet/messages";
import { v4 as uuid } from "uuid";

const STARTING_CONTAINER: Container = {
  id: uuid(),
  height: 3,
  width: 3,
  slotIds: [],
};

/**
 * Set up local state to hold onto messages received from the server.
 *
 * Concerns:
 * - Listen to incoming messages and set state.
 * - Provide functions to other hooks to modify state.
 *
 */
export const useStore = () => {
  const [state, setState] = useImmer<State>({
    messages: [],
    containerIds: [STARTING_CONTAINER.id],
    containerMap: { [STARTING_CONTAINER.id]: STARTING_CONTAINER },
    currentContainerId: undefined,
    itemMap: {},
    slotMap: {},
    heldItemId: undefined,
  });
  // This used to do more...

  const clearHistory = useCallback(() => {
    setState((draft) => {
      draft.messages = [];
    });
  }, [setState]);
  const addSlot = useCallback(
    ({
      itemId,
      x,
      y,
      containerId,
    }: {
      itemId: string;
      x: number;
      y: number;
      containerId: string;
    }) => {
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
  const setHeldItem = useCallback(
    (itemId: string) => {
      setState((draft) => {
        draft.heldItemId = itemId;
      });
    },
    [setState],
  );
  const moveItem = useCallback(
    ({
      slotId,
      x,
      y,
      containerId,
    }: {
      slotId: string;
      x: number;
      y: number;
      containerId: string;
    }) => {
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

  return {
    addSlot,
    setHeldItem,
    moveItem,
    clearHistory,
    inventory,
    heldItem,
    setState,
  };
};
