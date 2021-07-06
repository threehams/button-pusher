describe("dictionary", () => {
  it("executes a remote dictionary attack", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        // Call some code to initialize the fake server part using MockSocket
        cy.stub(win, "WebSocket" as any, (url: string) => new WebSocket(url));
      },
    });
    cy.findByText("Travel to the Killing Fields").click();
    cy.findByText("Kill something").click();

    cy.getId("handSlot").invoke("offset").as("source");
    cy.getId({ name: "inventorySlot", index: 0 }).invoke("offset").as("target");

    cy.getId("handSlot").then((element) => {
      cy.alias("source").then((coords) => {
        element.trigger("mousedown", {
          clientX: coords.left + 10,
          clientY: coords.top + 10,
        });
      });
    });
    cy.getId({ name: "inventorySlot", index: 0 }).then((element) => {
      cy.alias("target").then((coords) => {
        element.trigger("mousemove", {
          clientX: coords.left + 10,
          clientY: coords.top + 10,
        });
      });
      cy.alias("target").then((coords) => {
        element.trigger("mouseup", {
          clientX: coords.left + 10,
          clientY: coords.top + 10,
        });
      });
    });
  });
});
