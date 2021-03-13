import { Record, Static } from "runtypes";
import { getObjectMap } from "./getObjectMap";
import { PurchasedUpgradeState } from "./PurchasedUpgradeState";
import { UpgradeType } from "./UpgradeType";

export const PurchasedUpgradeMapState = Record(
  getObjectMap(UpgradeType, PurchasedUpgradeState),
);
export type PurchasedUpgradeMapState = Static<typeof PurchasedUpgradeMapState>;
