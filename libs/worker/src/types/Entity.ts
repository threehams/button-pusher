import { Component } from "../components";

export type Entity<TNames extends Component["type"]> = {
  id: string;
  components: {
    [Name in Component["type"]]: Name extends TNames
      ? Extract<Component, { type: Name }>
      : undefined;
  };
};
