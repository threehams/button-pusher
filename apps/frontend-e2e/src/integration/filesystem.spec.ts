import { WebSocket } from "mock-socket";
import { createMockSocket } from "../support/createMockSocket";

describe("filesystem", () => {
  beforeEach(() => {
    createMockSocket(({ onCommand, sendMessage }) => {
      onCommand("internal_login threehams", () => {
        sendMessage(100, {
          update: "Filesystem",
          payload: {
            ip: "8.8.8.8",
            contents: [
              {
                id: "1",
                contents: ["2"],
                type: "Folder",
                name: "FILESYSTEM_ROOT",
                executable: true,
                owner: "root",
                size: 0,
                updatedAt: "2017-05-01T01:00:40.406Z",
              },
              {
                id: "2",
                contents: ["3", "4", "5"],
                type: "Folder",
                name: "warez",
                executable: true,
                owner: "threehams",
                size: 0,
                updatedAt: "2018-05-04T00:51:40.406Z",
              },
              {
                id: "3",
                contents: [],
                type: "Folder",
                name: "mp3",
                executable: true,
                owner: "threehams",
                size: 0,
                updatedAt: `${new Date().getFullYear()}-07-04T00:51:40.406Z`,
              },
              {
                id: "4",
                type: "File",
                name: "doom2-full.exe",
                executable: true,
                owner: "threehams",
                size: 709865,
                updatedAt: "2019-02-04T00:51:40.406Z",
              },
              {
                id: "5",
                type: "File",
                name: "other.jpg",
                executable: false,
                owner: "root",
                size: 102932,
                updatedAt: "2019-01-04T00:51:40.406Z",
              },
            ],
            root: "1",
          },
        });
      });
    }).as("mockServer");
  });

  it("allows filesystem navigation", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        // Call some code to initialize the fake server part using MockSocket
        cy.stub(win, "WebSocket" as any, (url: string) => new WebSocket(url));
      },
    });
    cy.findByLabelText("Enter Username").type(`threehams{enter}`);
    cy.getId("messages").should("contain.text", "Logged in as threehams");
    cy.getId("commandPrompt").should("contain.text", "threehams@local:$");
    cy.get("body").type("ls{enter}");
    cy.getId("messages").should("contain.text", "warez/");
    cy.get("body").type("cd warez{enter}");
    cy.getId("commandPrompt").should("contain.text", "threehams@local:/warez$");
    cy.get("body").type("ls{enter}");
    cy.getId("messages").should("contain.text", "mp3/");
    cy.getId("messages").should("contain.text", "doom2-full.exe");
    cy.get("body").type("cd mp3{enter}");
    cy.getId("commandPrompt").should(
      "contain.text",
      "threehams@local:/warez/mp3$",
    );
    cy.get("body").type("cd ..{enter}");
    cy.getId("commandPrompt").should("contain.text", "threehams@local:/warez$");

    cy.get("body").type("cd ..{enter}");
    cy.getId("commandPrompt").should("contain.text", "threehams@local:$");
    cy.get("body").type("ls{enter}");
  });

  it("rejects nonexistent folders", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        // Call some code to initialize the fake server part using MockSocket
        cy.stub(win, "WebSocket" as any, (url: string) => new WebSocket(url));
      },
    });
    cy.findByLabelText("Enter Username").type(`threehams{enter}`);
    cy.getId("messages").should("contain.text", "Logged in as threehams");
    cy.get("body").type("cd nope{enter}");
    cy.getId("messages").should(
      "contain.text",
      "cd: nope: directory not found",
    );
    cy.getId("commandPrompt").should("contain.text", "threehams@local:$");
    cy.get("body").type("cd ..{enter}");
    cy.getId("commandPrompt").should("contain.text", "threehams@local:$");

    cy.get("body").type("ls{enter}");
    cy.getId("messages").should("contain.text", "warez/");
    cy.get("body").type("cd warez/mp3{enter}");
    cy.getId("commandPrompt").should(
      "contain.text",
      "threehams@local:/warez/mp3$",
    );

    cy.get("body").type("cd /{enter}");
    cy.getId("commandPrompt").should("contain.text", "threehams@local:$");
    cy.get("body").type("cd /warez///mp3/{enter}");
    cy.getId("commandPrompt").should(
      "contain.text",
      "threehams@local:/warez/mp3$",
    );

    cy.get("body").type("cd /{enter}");
    cy.getId("commandPrompt").should("contain.text", "threehams@local:$");
    cy.get("body").type("cd /warez/mp3{enter}");
    cy.getId("commandPrompt").should(
      "contain.text",
      "threehams@local:/warez/mp3$",
    );
  });

  it("supports display options", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        // Call some code to initialize the fake server part using MockSocket
        cy.stub(win, "WebSocket" as any, (url: string) => new WebSocket(url));
      },
    });
    cy.findByLabelText("Enter Username").type(`threehams{enter}`);
    cy.getId("messages").should("contain.text", "Logged in as threehams");
    cy.get("body").type("cd warez{enter}");
    cy.get("body").type("ls -l{enter}");
    cy.getId("messages")
      .should("contain.text", "threehams0Jul 03 05:51mp3")
      .should("contain.text", "threehams709865Feb 03 2019doom2-full.exe")
      .should("contain.text", "root102932Jan 03 2019other.jpg");

    cy.get("body").type("cd /warez{enter}");
    cy.get("body").type("cls{enter}");
    cy.get("body").type("ls -a{enter}");
    cy.getId("messages")
      .should("contain.text", "./")
      .should("contain.text", "../");

    cy.get("body").type("cd /{enter}");
    cy.get("body").type("cls{enter}");
    cy.get("body").type("ls -la{enter}");
    cy.getId("messages")
      .should("contain.text", "root0Apr 30 2017./")
      .should("contain.text", "root0Apr 30 2017../");

    cy.get("body").type("cd /warez{enter}");
    cy.get("body").type("cls{enter}");
    cy.get("body").type("ls -la{enter}");
    cy.getId("messages")
      .should("contain.text", "threehams0May 03 2018./")
      .should("contain.text", "root0Apr 30 2017../");

    cy.get("body").type("cd /warez/mp3{enter}");
    cy.get("body").type("cls{enter}");
    cy.get("body").type("ls -la{enter}");
    cy.getId("messages")
      .should("contain.text", "threehams0Jul 03 05:51./")
      .should("contain.text", "threehams0May 03 2018../");
  });
});
