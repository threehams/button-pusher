import { AnyAction } from "./actions";
import { inventoryReducer } from "./inventoryReducer";
import { PlayersState } from "../PlayersState";
import { locationReducer } from "./locationReducer";
import { skillsReducer } from "./skillsReducer";
import { moneysReducer } from "./moneysReducer";
import produce from "immer";
import {
  selectBags,
  selectCurrentCapacity,
  selectFloor,
  selectInventory,
} from "./selectors";
import { v4 as uuid } from "uuid";

const INITIAL_STATE: PlayersState = {};

export const playersReducer = (
  state: PlayersState = INITIAL_STATE,
  action: AnyAction,
): PlayersState => {
  if (action.type === "RESET") {
    return {};
  }
  if (action.type === "CREATE_PLAYER") {
    return produce(state, (draft) => {
      const id = uuid();
      draft[id] = {
        id,
        name: action.payload.name,
        inventory: inventoryReducer(undefined, action),
        location: locationReducer(undefined, action),
        skills: skillsReducer(undefined, action),
        moneys: moneysReducer(undefined, action),
      };
    });
  }
  if (!isPlayerAction(action)) {
    return state;
  }
  const { playerId } = action.payload;
  return produce(state, (draft) => {
    if (action.type === "SELL_ITEM") {
      const { inventory, moneys } = draft[playerId];
      const container = Object.values(inventory.purchasedContainerMap).filter(
        (cont) =>
          cont.slotIds.length && (cont.type === "BAG" || cont.type === "EQUIP"),
      )[0];
      if (!container) {
        return;
      }
      const slotId = container.slotIds[0];
      moneys.moneys += Math.floor(
        inventory.itemMap[inventory.slotMap[slotId].itemId].value,
      );
      moneys.highestMoneys = Math.max(moneys.moneys, moneys.highestMoneys);
      container.slotIds = container.slotIds.filter((id) => id !== slotId);
      inventory.slotMap[slotId] = undefined!; // it's fine as long as I removed all references
    }

    const bags = selectBags({ players: draft }, { playerId });
    const currentCapacity = selectCurrentCapacity(
      { players: draft },
      { playerId },
    );
    const floor = selectFloor(
      { players: draft },
      { playerId, playerLocation: draft[playerId].location.location },
    );
    const getInventory = ({ containerId }: { containerId: string }) => {
      return selectInventory({ players: draft }, { playerId, containerId });
    };
    draft[playerId].inventory = inventoryReducer(
      draft[playerId].inventory,
      action,
      {
        bags,
        currentCapacity,
        floor,
        getInventory,
      },
    );
    draft[playerId].location = locationReducer(
      state[playerId].location,
      action,
    );
    draft[playerId].skills = skillsReducer(state[playerId].skills, action);
  });
};

const isPlayerAction = (
  action: any,
): action is { payload: { playerId: string } } => {
  return action?.payload?.playerId;
};
