import { WebSocket } from "mock-socket";
import { createMockSocket } from "../support/createMockSocket";

describe("portscan", () => {
  it("completes a portscan", () => {
    createMockSocket(({ onCommand, sendMessage }) => {
      onCommand("portscan 199.201.159.101", () => {
        sendMessage(100, {
          update: "Devices",
          payload: {
            devices: [
              {
                ip: "199.201.159.101",
                commands: ["[sshcrack](sshcrack|199.201.159.1)"],
              },
            ],
          },
        });
        sendMessage(250, {
          update: "PortscanProcess",
          payload: {
            id: "1",
            command: "portscan",
            origin: "localhost",
            target: "199.201.159.101",
            progress: 10,
            complete: false,
            error: null,
            ports: [{ name: "telnet", number: 23 }],
          },
        });
        sendMessage(500, {
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
        sendMessage(1000, {
          update: "PortscanProcess",
          payload: {
            id: "1",
            command: "portscan",
            origin: "localhost",
            target: "199.201.159.101",
            progress: 100,
            complete: true,
            error: null,
            ports: [
              { name: "telnet", number: 23 },
              { name: "http", number: 80 },
            ],
          },
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
    cy.findByText("portscan").click();
    cy.findByText("portscan").should("not.exist");
    cy.getId("messages").should("contain.text", `$ portscan 8.8.8.8`);
    cy.findByText(/portscan \([0-9]+%\)/).click();
    cy.getId("portscanProgram").should("contain.text", "23/tcp");
    cy.getId("portscanProgram").should("contain.text", "80/tcp");
    cy.findByText("Close").click();
    cy.get("body").type("process{enter}");
  });
});
