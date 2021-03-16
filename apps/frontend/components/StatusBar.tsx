import { selectHeldSlot } from "@botnet/store";
import React from "react";
import { useSelector } from "react-redux";
import { useProgress } from "../hooks/ProgressContext";
import { Progress } from "./Progress";

export const StatusBar = () => {
  const heldSlot = useSelector(selectHeldSlot);
  const player = useSelector((state) => state.player);
  const progress = useProgress();
  if (progress.autoSort) {
    return (
      <Progress percent={progress.autoSort}>
        Now where should I put this...
      </Progress>
    );
  } else if (progress.autoTravel) {
    return (
      <Progress percent={progress.autoTravel}>
        Deciding where to travel
      </Progress>
    );
  } else if (progress.travel) {
    return (
      <Progress percent={progress.travel}>
        Travelling to{" "}
        {player.destination === "TOWN" ? "Town" : "the Killing Fields"}
      </Progress>
    );
  } else if (progress.autoSell) {
    return (
      <Progress percent={progress.autoSell}>Looking for a vendor</Progress>
    );
  } else if (progress.autoKill) {
    return (
      <Progress percent={progress.autoKill}>
        Searching for something to kill
      </Progress>
    );
  } else if (progress.autoPack) {
    return (
      <Progress percent={progress.autoPack}>Searching for storage</Progress>
    );
  } else if (progress.pack) {
    return (
      <Progress percent={progress.pack}>Storing {heldSlot?.item.name}</Progress>
    );
  } else if (progress.autoDropJunk) {
    return (
      <Progress percent={progress.autoDropJunk}>Deciding what to drop</Progress>
    );
  } else if (progress.autoTrash) {
    return (
      <Progress percent={progress.autoTrash}>Leaving this junk behind</Progress>
    );
  }
  return null;
};
