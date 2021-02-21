import { WebSocket, Server } from "mock-socket";
import { Message } from "@botnet/messages";

export type CloseServer = () => void;
type OnCommand = (
  command: string | RegExp,
  handler: (command: string) => void,
) => void;
type Result = {
  socket: WebSocket;
  sendMessage: (delay: number, message: Message) => void;
  onCommand: OnCommand;
};
export const createMockSocket = (callback: (result: Result) => void) => {
  let open = true;
  const mockServer = new Server("ws://localhost:31337/game");
  mockServer.on("connection", (socket) => {
    const sendMessage = (delay: number, message: Message) => {
      setTimeout(() => {
        if (open) {
          socket.send(JSON.stringify(message));
        }
      }, delay);
    };
    const onCommand: OnCommand = (command, handler) => {
      if (command instanceof RegExp) {
        return;
      }
      socket.on("message", (message) => {
        if (message === command) {
          handler(message);
        }
      });
    };
    callback({ socket, sendMessage, onCommand });
  });
  const closeServer: CloseServer = () => {
    open = false;
    mockServer.close();
  };
  return cy.wrap({ mockServer, closeServer });
};
