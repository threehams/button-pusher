import { Inventory, selectFloor, selectPurchasedUpgrades } from "@botnet/store";
import React from "react";
import { range } from "lodash";
import { InventorySlot } from "../InventorySlot";
import { InventoryItem } from "../InventoryItem";
import { Button } from "../Button";
import { AutoAction } from "../AutoAction";
import { useProgress } from "../../hooks/ProgressContext";
import { useDispatch, useSelector } from "react-redux";
import { theme } from "@botnet/ui";
import { usePlayerId } from "../../hooks/PlayerContext";
import { serializeDragId } from "apps/frontend/lib/dragId";
import { CanDrop } from "apps/frontend/lib/canDrop";

type Props = {
  inventory: Inventory;
  canDrop: CanDrop;
};
export const InventoryPanel = React.memo(({ canDrop, inventory }: Props) => {
  const playerId = usePlayerId();
  const player = useSelector((state) => state.players[playerId].location);
  const progress = useProgress();
  const dispatch = useDispatch();
  const { nextAvailable, height, width, slots, cost } = inventory;
  const moneys = useSelector((state) => state.players[playerId].moneys.moneys);
  const floor = useSelector((state) =>
    selectFloor(state, { playerLocation: player.location, playerId }),
  );
  const purchasedUpgrades = useSelector((state) =>
    selectPurchasedUpgrades(state, { playerId }),
  );

  return (
    <div>
      {!nextAvailable && inventory.type === "BAG" && (
        <Button
          disabled={!cost || cost > moneys}
          onClick={() => {
            if (cost) {
              dispatch({
                type: "UPGRADE_CONTAINER",
                payload: { playerId, id: inventory.id, cost },
              });
            }
          }}
        >
          Upgrade Bag: {cost ? `$${cost}` : "(MAX)"}
          {!cost}
        </Button>
      )}

      <div className="flex items-center">
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
                dragId={serializeDragId({
                  x: slot.x,
                  y: slot.y,
                  width: slot.item.width,
                  height: slot.item.height,
                  slotId: slot.id,
                  containerId: inventory.id,
                })}
              />
            );
          })}
          <div
            className="border border-b-0 border-gray-50 border-r-0 border-solid grid"
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
                const { required, valid } = canDrop({
                  x: y,
                  y: x,
                  containerId: inventory.id,
                });
                return (
                  <InventorySlot
                    containerId={inventory.id}
                    x={x}
                    y={y}
                    key={`${y}${x}`}
                    required={required}
                    state={valid ? "VALID" : "INVALID"}
                    data-test="inventorySlot"
                    data-test-item={x + y}
                  />
                );
              });
            })}
          </div>
        </div>
      </div>
      {inventory.type === "FLOOR" && (
        <div className="mt-3 pr-3 w-1/2">
          <AutoAction
            percent={progress.trash}
            upgrade={purchasedUpgrades.autoTrash}
            upgradeName="autoTrash"
            disabled={!floor || !floor.slots.length}
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
