/**
 * Represents a simple selector interface for Cypress testing.
 * This interface defines methods for element retrieval and assertions.
 */
export interface SimpleSelector {
  /** The raw selector string used to identify elements. */
  rawSelector: string;

  /**
   * Retrieves the element(s) matching the selector.
   * @template E The type of DOM Node (defaults to HTMLElement).
   * @returns A Cypress chain containing the matched element(s).
   */
  retrieve<E extends Node = HTMLElement>(): Cypress.Chainable<JQuery<E>>;

  /**
   * Retrieves the element(s) matching the selector with a specified timeout.
   * @template E The type of DOM Node (defaults to HTMLElement).
   * @param timeout The timeout in seconds.
   * @returns A Cypress chain containing the matched element(s).
   */
  retrieveWithTimeout<E extends Node = HTMLElement>(timeout: number): Cypress.Chainable<JQuery<E>>;

  /**
   * Finds child elements within the current selector context.
   * @template E The type of DOM Node (defaults to HTMLElement).
   * @param selector The SimpleSelector to find within the current context.
   * @returns A Cypress chain containing the matched child element(s).
   */
  find<E extends Node = HTMLElement>(selector: SimpleSelector): Cypress.Chainable<JQuery<E>>;

  /** Asserts that the selected element is clickable. */
  assertIsClickable(): void;

  /** Asserts that the selected element is writable. */
  assertIsWritable(): void;

  /**
   * Asserts that the selected element contains the specified text.
   * @param text The text to check for within the element.
   */
  assertContainsText(text: string): void;
}

/**
 * Implements the SimpleSelector interface, providing methods for
 * element selection and assertion in Cypress tests.
 */
export default class Selector implements SimpleSelector {
  readonly rawSelector: string;

  /**
   * Creates a new Selector instance.
   * @param selector The raw selector string.
   */
  constructor(selector: string) {
    this.rawSelector = selector;
  }

  /**
   * Creates a new Selector instance from a string.
   * @param selector The raw selector string.
   * @returns A new Selector instance.
   */
  static from(selector: string): Selector {
    return new Selector(selector);
  }

  /**
   * Creates a new Selector by appending a string to the current selector.
   * @param selector The selector string to append.
   * @returns A new Selector instance with the combined selector.
   */
  with(selector: string): Selector {
    return new Selector(`${this.rawSelector} ${selector}`);
  }

  find<E extends Node = HTMLElement>(selector: SimpleSelector): Cypress.Chainable<JQuery<E>> {
    return this.retrieve().find(selector.rawSelector)
  }

  public retrieve<E extends Node = HTMLElement>(): Cypress.Chainable<JQuery<E>> {
    return cy.get(this.rawSelector);
  }

  public retrieveWithTimeout<E extends Node = HTMLElement>(timeout: number): Cypress.Chainable<JQuery<E>> {
    const timeoutInMs = timeout * 1000;  
    return cy.get(this.rawSelector, { timeout: timeoutInMs });
  }

  public assertContainsText(text: string): void {
    this.retrieveWithTimeout(10) 
      .invoke("text")
      .then((content) => {
        cy.log(`Checking if element contains text: "${text}"`);
        expect(content.trim()).to.include(text);
      });
  }

  public assertIsClickable(): void {
    this.retrieve()
      .should("be.visible")
      .should("be.enabled")
      .click()
      .then(() => {
        cy.log(`Clicked on element: "${this.rawSelector}"`);
      });
  }

  public assertIsWritable(): void {
    this.retrieve()
      .should("be.visible")
      .should("be.enabled")
      .should("not.have.attr", "readonly")
      .type("Test input")
      .should("have.value", "Test input")
      .clear()
      .should("have.value", "")
      .then(() => {
        cy.log(`Element is writable: "${this.rawSelector}"`);
      });
  }
}