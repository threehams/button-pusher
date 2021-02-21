import "@testing-library/cypress/add-commands";
import { Server } from "mock-socket";

type Aliases = {
  mockServer: { mockServer: Server; closeServer: () => void };
};

type ItemLocator<T> = {
  name: T;
  item: string;
  index?: never;
};
type IndexLocator<T> = {
  name: T;
  index: number;
  item?: never;
};
type Locator<T> = string | ItemLocator<T> | IndexLocator<T>;
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Chainable<Subject> {
      /**
       * Get an element by data-test attribute.
       * @example
       * cy.getId("print-button")
       */
      getId<TLocator = string>(
        id: Locator<TLocator> | Array<Locator<TLocator>>,
        options?: Partial<Loggable & Timeoutable>,
      ): Chainable<JQuery<HTMLElement>>;

      alias<TAlias extends keyof Aliases>(
        name: TAlias,
      ): Chainable<Aliases[TAlias]>;
    }
  }
}

// @ts-ignore
Cypress.SelectorPlayground.defaults({
  selectorPriority: ["data-test"],
  onElement: (element: JQuery) => {
    const test = element.data("test");
    if (!test) {
      return "";
    }

    const parents = Array.from(element.parents("[data-test]"))
      .reverse()
      .map((parent) => {
        const id = parent.dataset["test"];
        const itemId = parent.dataset["test-item"];
        if (itemId) {
          return `{ name: "${id}", item: "${itemId}" }`;
        }
        return `"${id}"`;
      })
      .join(", ");

    const testItem = element.data("test-item");
    const selector = testItem
      ? `{ name: "${test}", item: "${testItem}" }`
      : `"${test}"`;
    return parents ? `[${parents}, ${selector}]` : `${selector}`;
  },
});
Cypress.Commands.add(
  "getId",
  <T = string>(
    locators: Locator<T> | Array<Locator<T>>,
    options: Partial<Cypress.Loggable & Cypress.Timeoutable> = {},
  ) => {
    locators = Array.isArray(locators) ? locators : [locators];

    return cy.get(
      locators
        .map((locator) => {
          if (typeof locator === "string") {
            return `[data-test=${locator}]`;
          }
          if (locator.item !== undefined) {
            return `[data-test=${locator.name}][data-test-item=${locator.item}]`;
          }
          return `[data-test=${locator.name}]:eq(${locator.index})`;
        })
        .join(" "),
      options,
    );
  },
);

Cypress.Commands.add("alias", <TAlias extends keyof Aliases>(alias: TAlias) => {
  return cy.get<any>(`@${alias}`);
});
