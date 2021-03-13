import { Record, Static } from "runtypes";
import { getObjectMap } from "./getObjectMap";
import { Upgrade } from "./Upgrade";
import { UpgradeType } from "./UpgradeType";

export const UpgradeMap = Record(getObjectMap(UpgradeType, Upgrade));
export type UpgradeMap = Static<typeof UpgradeMap>;
