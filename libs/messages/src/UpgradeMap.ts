import { Record, Static } from "runtypes";
import { Upgrade } from "./Upgrade";

export const UpgradeMap = Record({
  APPRAISE: Upgrade,
  AUTOMATE_APPRAISE: Upgrade,
  PACK: Upgrade,
  AUTOMATE_PACK: Upgrade,
  SELL: Upgrade,
  AUTOMATE_SELL: Upgrade,
  SORT: Upgrade,
  AUTOMATE_SORT: Upgrade,
  TRAVEL: Upgrade,
  AUTOMATE_TRAVEL: Upgrade,
  KILL: Upgrade,
  AUTOMATE_KILL: Upgrade,
  DROP_JUNK: Upgrade,
  AUTOMATE_DROP_JUNK: Upgrade,
});
export type UpgradeMap = Static<typeof UpgradeMap>;
