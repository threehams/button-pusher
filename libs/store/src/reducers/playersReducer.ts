import { AnyAction } from "./actions";
import { inventoryReducer } from "./inventoryReducer";
import { PlayersState } from "../PlayersState";
import { locationReducer } from "./locationReducer";
import produce from "immer";
import {
  selectBags,
  selectCurrentCapacity,
  selectFloor,
  selectHeldSlot,
  selectInventory,
  selectPurchasedUpgrades,
} from "./selectors";
import { v4 as uuid } from "uuid";

const INITIAL_STATE: PlayersState = {};

export const playersReducer = (
  state: PlayersState = INITIAL_STATE,
  action: AnyAction,
): PlayersState => {
  if (action.type === "CREATE_PLAYER") {
    return produce(state, (draft) => {
      const id = uuid();
      draft[id] = {
        id,
        inventory: inventoryReducer(undefined, action),
        location: locationReducer(undefined, action),
        name: action.payload.name,
      };
    });
  }
  if (!isPlayerAction(action)) {
    return state;
  }
  const { playerId } = action.payload;
  return produce(state, (draft) => {
    const bags = selectBags({ players: state }, { playerId });
    const heldSlot = selectHeldSlot({ players: state }, { playerId });
    const currentCapacity = selectCurrentCapacity(
      { players: state },
      { playerId },
    );
    const purchasedUpgrades = selectPurchasedUpgrades(
      { players: state },
      { playerId },
    );
    const floor = selectFloor(
      { players: state },
      { playerId, playerLocation: state[playerId].location.location },
    );
    const getInventory = ({ containerId }: { containerId: string }) => {
      return selectInventory({ players: state }, { playerId, containerId });
    };
    draft[playerId].inventory = inventoryReducer(
      state[playerId].inventory,
      action,
      {
        bags,
        heldSlot,
        currentCapacity,
        floor,
        purchasedUpgrades,
        getInventory,
      },
    );
    draft[playerId].location = locationReducer(
      state[playerId].location,
      action,
    );
  });
};

const isPlayerAction = (
  action: any,
): action is { payload: { playerId: string } } => {
  return action?.payload?.playerId;
};
