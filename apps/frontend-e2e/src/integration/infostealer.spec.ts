import { WebSocket } from "mock-socket";
import { createMockSocket } from "../support/createMockSocket";
import { InfostealerProcess } from "@botnet/messages";
import produce from "immer";

const process: InfostealerProcess = {
  id: "4",
  command: "infostealer",
  complete: false,
  error: null,
  logins: [],
  target: "199.201.159.1",
};

const device = {
  ip: "199.201.159.101",
  commands: ["[infostealer](install|infostealer|199.201.159.101)"],
};

describe("infostealer", () => {
  it("installs an infostealer onto a remote system", () => {
    createMockSocket(({ onCommand, sendMessage }) => {
      onCommand("internal_login threehams", () => {
        sendMessage(100, {
          update: "Devices",
          payload: {
            devices: [device],
          },
        });
      });

      onCommand("install infostealer 199.201.159.101", () => {
        sendMessage(100, {
          update: "Devices",
          payload: {
            devices: [
              produce(device, (draft) => {
                draft.commands = [];
              }),
            ],
          },
        });
        sendMessage(350, {
          update: "Terminal",
          payload: {
            message: "[199.201.159.101] infostealer installed. Running...",
          },
        });

        sendMessage(400, {
          update: "InfostealerProcess",
          payload: process,
        });
        sendMessage(800, {
          update: "InfostealerProcess",
          payload: produce(process, (draft) => {
            draft.logins = [{ username: "root", password: null }];
          }),
        });
        sendMessage(1200, {
          update: "InfostealerProcess",
          payload: produce(process, (draft) => {
            draft.logins = [
              { username: "root", password: null },
              { username: "admin", password: "Tr0ub4d0r!" },
            ];
          }),
        });
        sendMessage(1600, {
          update: "InfostealerProcess",
          payload: produce(process, (draft) => {
            draft.logins = [
              { username: "root", password: null },
              { username: "admin", password: "Tr0ub4d0r!" },
              { username: null, password: "remarkablepenguinmonstrosity" },
            ];
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
    cy.findByText("199.201.159.101").click();

    cy.findByText("Install Malware").click();
    cy.findByText("infostealer").click();
    cy.getId("messages").should(
      "contain.text",
      "[199.201.159.101] infostealer installed. Running...",
    );
    cy.findByText("infostealer").click();
    cy.getId("infostealerProgram")
      .should("contain.text", 'username found: "root"')
      .should("contain.text", 'password found: "remarkablepenguinmonstrosity"')
      .should("contain.text", 'login found: "admin" / "Tr0ub4d0r!"');
  });
});
