import {
  Inventory,
  selectFloor,
  selectInventoryPagination,
  selectPurchasedUpgrades,
  SlotInfo,
} from "@botnet/store";
import React, { useCallback, useState } from "react";
import { range } from "lodash";
import { InventorySlot } from "../InventorySlot";
import { InventoryItem } from "../InventoryItem";
import { getTargetCoords } from "@botnet/store";
import { Button } from "../Button";
import { AutoAction } from "../AutoAction";
import { useProgress } from "../../hooks/ProgressContext";
import { useDispatch, useSelector } from "react-redux";
import { theme } from "@botnet/ui";
import { usePlayerId } from "../../hooks/PlayerContext";

type Props = {
  inventory: Inventory;
};
export const InventoryPanel = React.memo(({ inventory }: Props) => {
  const playerId = usePlayerId();
  const player = useSelector((state) => state.players[playerId].location);
  const progress = useProgress();
  const dispatch = useDispatch();
  const { nextAvailable, height, width, slots, cost } = inventory;
  const moneys = useSelector(
    (state) => state.players[playerId].inventory.moneys,
  );
  const pages = useSelector((state) =>
    selectInventoryPagination(state, { playerId }),
  );
  const floor = useSelector((state) =>
    selectFloor(state, { playerLocation: player.location, playerId }),
  );
  const purchasedUpgrades = useSelector((state) =>
    selectPurchasedUpgrades(state, { playerId }),
  );
  const [target, setTarget] = useState<SlotInfo | undefined>();

  const canDrop = useCallback(
    (tgt: SlotInfo) => {
      return !!getTargetCoords({ inventory, target: tgt })?.valid;
    },
    [inventory],
  );
  const targetCoords = target
    ? getTargetCoords({
        inventory,
        target,
      })
    : undefined;

  return (
    <div>
      {!nextAvailable && inventory.type === "BAG" && (
        <Button
          disabled={!cost || cost > moneys}
          onClick={() => {
            if (cost) {
              dispatch({
                type: "BUY_CONTAINER_UPGRADE",
                payload: { playerId, id: inventory.id },
              });
            }
          }}
        >
          Upgrade Bag: {cost ? `$${cost}` : "(MAX)"}
          {!cost}
        </Button>
      )}

      <div className="flex items-center">
        {!!(pages.prev || pages.next) && (
          <button
            disabled={!pages.prev}
            onClick={() => {
              pages.prev &&
                dispatch({
                  type: "GO_INVENTORY",
                  payload: { playerId, containerId: pages.prev },
                });
            }}
            className="p-3"
          >
            &lt;
          </button>
        )}
        <div className="relative">
          {slots.map((slot) => {
            return (
              <InventoryItem
                key={slot.id}
                className="absolute"
                style={{
                  width: theme.tileSize * slot.item.width,
                  height: theme.tileSize * slot.item.height,
                  top: theme.tileSize * slot.y,
                  left: theme.tileSize * slot.x,
                }}
                item={slot.item}
                slotId={slot.id}
              />
            );
          })}
          <div
            className="grid border border-solid border-gray-50 border-r-0 border-b-0"
            style={{
              width: width * theme.tileSize,
              height: height * theme.tileSize,
              gridTemplateRows: range(0, height)
                .map(() => "1fr")
                .join(" "),
              gridTemplateColumns: range(0, width)
                .map(() => "1fr")
                .join(" "),
            }}
          >
            {range(0, height).map((y) => {
              return range(0, width).map((x) => {
                const required = !!targetCoords?.required.includes(`${y},${x}`);
                return (
                  <InventorySlot
                    containerId={inventory.id}
                    setTarget={setTarget}
                    canDrop={canDrop}
                    x={x}
                    y={y}
                    key={`${y}${x}`}
                    required={required}
                    state={
                      required && targetCoords?.valid ? "VALID" : "INVALID"
                    }
                  />
                );
              });
            })}
          </div>
        </div>
        {!!(pages.prev || pages.next) && (
          <button
            disabled={!pages.next}
            onClick={() => {
              pages.next &&
                dispatch({
                  type: "GO_INVENTORY",
                  payload: { playerId, containerId: pages.next },
                });
            }}
            className="p-3"
          >
            &gt;
          </button>
        )}
      </div>
      {inventory.type === "FLOOR" && (
        <div className="w-1/2 mt-3 pr-3">
          <AutoAction
            percent={progress.trash}
            upgrade={purchasedUpgrades.autoTrash}
            upgradeName="autoTrash"
            disabled={!floor.slots.length}
            onClick={() => {
              dispatch({ type: "TRASH", payload: { playerId } });
            }}
          >
            Leave Behind
          </AutoAction>
        </div>
      )}
    </div>
  );
});
