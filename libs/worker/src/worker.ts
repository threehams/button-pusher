import { Message } from "@botnet/messages";

const worker = (self as unknown) as Worker;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
worker.addEventListener("message", (event: { data: string }) => {
  const messages: string[] = [];

  if (messages.length) {
    const message: Message = {
      update: "Terminal",
      payload: {
        message: messages.join("\n"),
      },
    };
    worker.postMessage(message);
  }
});
