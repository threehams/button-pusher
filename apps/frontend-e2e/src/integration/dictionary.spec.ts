import { WebSocket } from "mock-socket";
import { createMockSocket } from "../support/createMockSocket";
import { SshCrackProcess } from "@botnet/messages";
import produce from "immer";

describe("dictionary", () => {
  it("executes a remote dictionary attack", () => {
    const process: SshCrackProcess = {
      id: "3",
      command: "sshcrack",
      origin: "localhost",
      target: "199.201.159.1",
      complete: false,
      error: null,
      progress: 0,
    };
    createMockSocket(({ onCommand, sendMessage }) => {
      onCommand("internal_login threehams", () => {
        sendMessage(100, {
          update: "Devices",
          payload: {
            devices: [
              {
                ip: "199.201.159.101",
                commands: ["[sshcrack](sshcrack|199.201.159.101)"],
              },
            ],
          },
        });
      });

      onCommand("sshcrack 199.201.159.101", () => {
        sendMessage(100, {
          update: "Devices",
          payload: {
            devices: [
              {
                ip: "199.201.159.101",
                commands: [],
              },
            ],
          },
        });
        sendMessage(300, {
          update: "Terminal",
          payload: {
            message: "[199.201.159.101] Found open port: 22 (SSH)",
          },
        });
        sendMessage(400, {
          update: "SshCrackProcess",
          payload: process,
        });
        sendMessage(800, {
          update: "SshCrackProcess",
          payload: produce(process, (draft) => {
            draft.progress = 25;
          }),
        });
        sendMessage(1200, {
          update: "SshCrackProcess",
          payload: produce(process, (draft) => {
            draft.progress = 50;
          }),
        });
        sendMessage(1600, {
          update: "SshCrackProcess",
          payload: produce(process, (draft) => {
            draft.progress = 75;
          }),
        });
        sendMessage(2000, {
          update: "SshCrackProcess",
          payload: produce(process, (draft) => {
            draft.progress = 100;
            draft.complete = true;
          }),
        });
      });
    }).as("mockServer");

    cy.visit("/", {
      onBeforeLoad(win) {
        // Call some code to initialize the fake server part using MockSocket
        cy.stub(win, "WebSocket" as any, (url: string) => new WebSocket(url));
      },
    });
    cy.findByLabelText("Enter Username").type(`threehams{enter}`);
    cy.getId("messages").should("contain.text", "Logged in as threehams");

    cy.findByText("Known Devices");
    cy.findByText("8.8.8.8").click();
    cy.findByText("sshcrack").click();
    cy.findByText("sshcrack").should("not.exist");
    cy.getId("messages").should("contain.text", `$ sshcrack 8.8.8.8`);
    cy.findByText(/sshcrack \([0-9]+%\)/).click();
    cy.getId("sshCrackProgram").should(
      "contain.text",
      "Success: 'msfadmin:Password123'",
    );
  });
});
