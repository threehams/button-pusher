import { Static, Dictionary } from "runtypes";
import { PurchasedContainer } from "./PurchasedContainer";

export const PurchasedContainerMap = Dictionary(PurchasedContainer);
export type PurchasedContainerMap = Static<typeof PurchasedContainerMap>;
