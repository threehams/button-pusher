import { Item, PurchasedUpgrade } from "@botnet/messages";
import { Pack } from "@botnet/store";

const PACK_INTERVAL = 1000;

type AutoPack = {
  upgrade: PurchasedUpgrade;
  heldItem: Item | undefined;
  lastPack: React.MutableRefObject<number>;
  pack: Pack;
  delta: number;
};
export const autoPack = ({
  upgrade,
  heldItem,
  lastPack,
  pack,
  delta,
}: AutoPack) => {
  if (!upgrade.level || !heldItem) {
    return;
  }
  lastPack.current = lastPack.current + delta;
  if (lastPack.current > PACK_INTERVAL) {
    pack({ itemId: heldItem.id });
    lastPack.current = 0;
  }
};
