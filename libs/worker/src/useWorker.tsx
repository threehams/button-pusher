import { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { Message } from "@botnet/messages";

const useWorkerLoader = () => {
  const workerRef = useRef<Worker>();
  const [lastMessage, setLastMessage] = useState<Message | undefined>(
    undefined,
  );

  useEffect(() => {
    workerRef.current = new Worker("./worker.ts", { type: "module" });
  }, []);

  if (workerRef.current) {
    workerRef.current.onmessage = (message) => {
      setLastMessage(message.data);
    };
  }

  const sendMessage = useCallback((message) => {
    workerRef.current?.postMessage(message);
  }, []);

  return {
    sendMessage,
    lastMessage,
    ready: !!workerRef.current,
  };
};

/**
 * Connect to the Websocket endpoint and hide away the
 * minutia of incoming messages.
 *
 * Concerns:
 * - Decide the URL to hit
 * - Connect, reconnect, and provide connection state
 * - Validate incoming message structure
 *
 */
export const useWorker = () => {
  const {
    sendMessage,
    lastMessage: lastMessageUnsafe,
    ready,
  } = useWorkerLoader();
  const lastMessage = useMemo(() => {
    if (!lastMessageUnsafe) {
      return null;
    }

    const updateNames = Message.alternatives.map(
      (record) => record.fields.update.value,
    );
    const update = lastMessageUnsafe?.update;
    if (!update || !updateNames.includes(update)) {
      // eslint-disable-next-line no-console
      console.error(
        `Received unknown update type ${update}. Known updates: ${updateNames}. Message received:`,
        lastMessageUnsafe,
      );
      return null;
    }
    const Record = Message.alternatives.find(
      (record) => record.fields.update.value === update,
    )!;

    try {
      return Record.check(lastMessageUnsafe);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(
        "Message failed validation.",
        err.message,
        "in",
        err.key,
        "in message",
        lastMessageUnsafe,
      );
      return null;
    }
  }, [lastMessageUnsafe]);
  return useMemo(() => ({ lastMessage, sendMessage, ready }), [
    lastMessage,
    ready,
    sendMessage,
  ]);
};
