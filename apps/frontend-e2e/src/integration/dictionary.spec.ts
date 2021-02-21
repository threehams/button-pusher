import produce from "immer";

describe("dictionary", () => {
  it("executes a remote dictionary attack", () => {
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
