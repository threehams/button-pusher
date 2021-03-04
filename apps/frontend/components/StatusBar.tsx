import { useStoreValue } from "@botnet/store";
import React from "react";
import { Progress } from "./Progress";

type Props = {
  autoTravelProgress: number;
  travelProgress: number;
  autoSellProgress: number;
  autoKillProgress: number;
  autoPackProgress: number;
  packProgress: number;
};
export const StatusBar = ({
  autoTravelProgress,
  travelProgress,
  autoSellProgress,
  autoKillProgress,
  autoPackProgress,
  packProgress,
}: Props) => {
  const { heldItem, playerDestination } = useStoreValue();
  if (autoTravelProgress) {
    return (
      <Progress percent={autoTravelProgress}>Deciding where to travel</Progress>
    );
  } else if (travelProgress) {
    return (
      <Progress percent={travelProgress}>
        Travelling to{" "}
        {playerDestination === "TOWN" ? "Town" : "the Killing Fields"}
      </Progress>
    );
  } else if (autoSellProgress) {
    return <Progress percent={autoSellProgress}>Looking for a vendor</Progress>;
  } else if (autoKillProgress) {
    return (
      <Progress percent={autoKillProgress}>
        Searching for something to kill...
      </Progress>
    );
  } else if (autoPackProgress) {
    return (
      <Progress percent={autoPackProgress}>Searching for storage...</Progress>
    );
  } else if (packProgress) {
    return <Progress percent={packProgress}>Storing {heldItem?.name}</Progress>;
  }
  return null;
};
