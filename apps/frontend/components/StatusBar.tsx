import { useStoreValue } from "@botnet/store";
import React from "react";
import { useProgress } from "../hooks/ProgressContext";
import { Progress } from "./Progress";

export const StatusBar = () => {
  const { heldSlot, playerDestination } = useStoreValue();
  const {
    autoKillProgress,
    autoPackProgress,
    autoSellProgress,
    autoTravelProgress,
    packProgress,
    travelProgress,
  } = useProgress();
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
    return (
      <Progress percent={packProgress}>Storing {heldSlot?.item.name}</Progress>
    );
  }
  return null;
};
