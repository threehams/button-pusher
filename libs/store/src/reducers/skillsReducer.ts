import produce from "immer";
import { SkillsState } from "../SkillsState";
import { AnyAction } from "./actions";

const getInitialState = (): SkillsState => {
  return {
    autoPack: {
      level: 0,
      enabled: true,
    },
    autoSell: {
      level: 0,
      enabled: true,
    },
    autoTravel: {
      level: 0,
      enabled: true,
    },
    autoSort: {
      level: 0,
      enabled: true,
    },
    sort: {
      level: 0,
      enabled: true,
    },
    pack: {
      level: 0,
      enabled: true,
    },
    autoKill: {
      level: 0,
      enabled: true,
    },
    kill: {
      level: 0,
      enabled: true,
    },
    sell: {
      level: 0,
      enabled: true,
    },
    travel: {
      level: 0,
      enabled: true,
    },
    dropJunk: {
      level: 0,
      enabled: true,
    },
    autoDropJunk: {
      level: 0,
      enabled: true,
    },
    trash: {
      level: 0,
      enabled: true,
    },
    autoTrash: {
      level: 0,
      enabled: true,
    },
  };
};

export const skillsReducer = (
  state: SkillsState = getInitialState(),
  action: AnyAction,
): SkillsState => {
  return produce(state, (draft) => {
    switch (action.type) {
      case "BUY_UPGRADE": {
        const { id } = action.payload;
        draft[id].level += 1;
        break;
      }
      case "CHEAT":
        if (action.payload.type !== "AUTOMATION") {
          return state;
        }
        Object.values(draft).forEach((upgrade) => {
          upgrade.level += 1;
        });
        break;
      case "DISABLE":
        draft[action.payload.upgrade].enabled = false;
        break;
      case "ENABLE":
        draft[action.payload.upgrade].enabled = true;
        break;
    }
  });
};
