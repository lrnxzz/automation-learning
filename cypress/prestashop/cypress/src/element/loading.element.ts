import Selector from "../selector/selector";

export default class LoadingElement {
  private readonly LOADING_SELECTOR: Selector;
  private readonly DYNAMICALLY_URL_SELECTOR: Selector =
    Selector.from("#framelive");

  constructor(loadingSelector: Selector) {
    this.LOADING_SELECTOR = loadingSelector;
  }

  visitDynamicUrl(): void {
    cy.log(`Retrieving the unique session URL and visiting it.`);

    this.DYNAMICALLY_URL_SELECTOR.retrieve()
      .its("0.src")
      .then((dynamicUrl) => {
        if (dynamicUrl) {
          cy.visit(dynamicUrl)
        } else {
          throw new Error("Dynamic URL not generated")
        }
      });
  }

  public assertLoading(): void {
    cy.log(`Asserting that the loading element is visible.`);
    this.LOADING_SELECTOR.retrieve().should("be.visible");
  }

  public assertFinished(timeout: number): void {
    cy.log(`Asserting that the loading element is not visible within ${timeout}ms.`);
    this.LOADING_SELECTOR.retrieveWithTimeout(timeout)
      .should("not.be.visible")
      .then(() => {
        cy.log("Loading element finished.");
        this.visitDynamicUrl();
      });
  }

  public assertElementIsLoaded(timeout: number): void {
    this.assertLoading();
    this.assertFinished(timeout);
  }
}