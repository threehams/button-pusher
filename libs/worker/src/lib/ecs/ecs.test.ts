import { ecs } from "./ecs";

describe("ecs", () => {
  describe("with", () => {
    it("selects entities with a single component", () => {
      const entities = ecs([]);
      entities.createEntity("1", {
        Location: { type: "Location", ip: "8.8.8.8" },
      });
      entities.createEntity("2", {
        Player: { type: "Player", homeIp: "199.201.159.1" },
      });
      expect(entities.with("Location")).toEqual([
        {
          id: "1",
          components: {
            Location: { type: "Location", ip: "8.8.8.8" },
          },
        },
      ]);
    });

    it("selects entities with multiple components", () => {
      const entities = ecs([]);
      entities.createEntity("1", {
        Location: { type: "Location", ip: "8.8.8.8" },
      });
      entities.createEntity("2", {
        Player: { type: "Player", homeIp: "199.201.159.1" },
      });
      entities.createEntity("3", {
        Player: { type: "Player", homeIp: "199.201.159.1" },
        Location: { ip: "10.1.20.42", type: "Location" },
      });
      expect(entities.with("Location", "Player")).toEqual([
        {
          id: "3",
          components: {
            Player: { type: "Player", homeIp: "199.201.159.1" },
            Location: { type: "Location", ip: "10.1.20.42" },
          },
        },
      ]);
    });
  });
});
