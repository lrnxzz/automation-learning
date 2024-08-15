export interface SimpleSelector {
  rawSelector: string;

  retrieve<E extends Node = HTMLElement>(): Cypress.Chainable<JQuery<E>>;
  retrieveWithTimeout<E extends Node = HTMLElement>(timeout: number): Cypress.Chainable<JQuery<E>>;
  find<E extends Node = HTMLElement>(selector: SimpleSelector): Cypress.Chainable<JQuery<E>>;

  assertIsClickable(): void;
  assertIsWritable(): void;

  assertContainsText(text: string): void;
}

export default class Selector implements SimpleSelector {
  readonly rawSelector: string;

  constructor(selector: string) {
    this.rawSelector = selector;
  }

  static from(selector: string): Selector {
    return new Selector(selector);
  }

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