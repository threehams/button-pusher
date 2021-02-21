import { findPath } from "./findPath";

describe("findPath", () => {
  it("generates an Internet backbone", () => {
    expect(
      findPath("199.201.159.1", "8.8.8.8")!.map((connection) => connection.ip),
    ).toEqual([
      "199.201.159.1",
      "199.91.46.82",
      "37.238.195.74",
      "8.8.147.222",
      "8.8.8.8",
    ]);
  });

  it("takes a shorter path if the target matches part of the path", () => {
    expect(
      findPath("199.201.159.1", "236.220.134.224")!.map(
        (connection) => connection.ip,
      ),
    ).toEqual([
      "199.201.159.1",
      "199.91.46.82",
      "37.238.195.74",
      "198.224.176.16",
      "190.216.236.172",
      "190.216.84.182.",
      "190.216.84.33.",
      "236.220.134.139",
      "236.220.134.224",
    ]);
  });

  it("paths directly to a node if it along the path up", () => {
    expect(
      findPath("199.201.159.1", "236.220.134.224")!.map(
        (connection) => connection.ip,
      ),
    ).toEqual([
      "199.201.159.1",
      "199.91.46.82",
      "37.238.195.74",
      "198.224.176.16",
      "190.216.236.172",
      "190.216.84.182.",
      "190.216.84.33.",
      "236.220.134.139",
      "236.220.134.224",
    ]);
  });

  it("returns the target if the source and target are the same", () => {
    expect(
      findPath("199.201.159.1", "199.201.159.1")!.map(
        (connection) => connection.ip,
      ),
    ).toEqual(["199.201.159.1"]);
  });
});
