import {
  Inventory,
  selectFloor,
  selectInventory,
  selectInventoryPagination,
  selectPurchasedUpgrades,
  SlotInfo,
} from "@botnet/store";
import React, { useCallback, useState } from "react";
import { range } from "lodash";
import { css, useTheme } from "@emotion/react";
import { InventorySlot } from "../InventorySlot";
import { InventoryItem } from "../InventoryItem";
import deepEqual from "deep-equal";
import { getTargetCoords } from "@botnet/store";
import { Button } from "../Button";
import { AutoAction } from "../AutoAction";
import { useProgress } from "../../hooks/ProgressContext";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  inventory: Inventory;
};
export const InventoryPanel = React.memo(({ inventory }: Props) => {
  const progress = useProgress();
  const dispatch = useDispatch();
  const { nextAvailable, height, width, slots, cost } = inventory;
  const moneys = useSelector((state) => state.data.moneys);
  const pages = useSelector(selectInventoryPagination);
  const floor = useSelector(selectFloor);
  const purchasedUpgrades = useSelector(selectPurchasedUpgrades);
  const [target, setTargetState] = useState<SlotInfo | undefined>();

  const setTarget = useCallback(
    (tgt: SlotInfo | undefined) => {
      if (!deepEqual(target, tgt)) {
        setTargetState(tgt);
      }
    },
    [target],
  );

  const theme = useTheme();
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
                payload: { id: inventory.id },
              });
            }
          }}
        >
          Upgrade Bag: {cost ? `$${cost}` : "(MAX)"}
          {!cost}
        </Button>
      )}

      <div
        css={css`
          display: flex;
          align-items: center;
        `}
      >
        {!!(pages.prev || pages.next) && (
          <button
            disabled={!pages.prev}
            onClick={() => {
              pages.prev &&
                dispatch({
                  type: "GO_INVENTORY",
                  payload: { containerId: pages.prev },
                });
            }}
            css={css`
              padding: 20px;
            `}
          >
            &lt;
          </button>
        )}
        <div
          css={css`
            position: relative;
          `}
        >
          {slots.map((slot) => {
            return (
              <InventoryItem
                key={slot.id}
                css={css`
                  position: absolute;
                  /* pointer-events: none; */
                  width: ${theme.tileSize * slot.item.width};
                  height: ${theme.tileSize * slot.item.height};
                  top: ${theme.tileSize * slot.y}px;
                  left: ${theme.tileSize * slot.x}px;
                `}
                item={slot.item}
                slotId={slot.id}
              />
            );
          })}
          <div
            css={css`
              display: grid;
              border-top: 1px solid #888;
              border-left: 1px solid #888;
              width: ${width * theme.tileSize}px;
              height: ${height * theme.tileSize}px;
              grid-template-rows: ${range(0, height)
                .map(() => "1fr")
                .join(" ")};
              grid-template-columns: ${range(0, width)
                .map(() => "1fr")
                .join(" ")};
            `}
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
                  payload: { containerId: pages.next },
                });
            }}
            css={css`
              padding: 20px;
            `}
          >
            &gt;
          </button>
        )}
      </div>
      {inventory.type === "FLOOR" && (
        <div
          css={css`
            width: 50%;
            margin-top: 20px;
            padding-right: 20px;
          `}
        >
          <AutoAction
            percent={progress.trash}
            upgrade={purchasedUpgrades.autoTrash}
            upgradeName="autoTrash"
            disabled={!floor.slots.length}
            onClick={() => {
              dispatch({ type: "TRASH" });
            }}
          >
            Leave Behind
          </AutoAction>
        </div>
      )}
    </div>
  );
});
