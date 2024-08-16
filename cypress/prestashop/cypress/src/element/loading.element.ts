import Selector from "../selector/selector";

export default class LoadingElement {
  private readonly LOADING_SELECTOR: Selector;
  private readonly DYNAMICALLY_URL_SELECTOR: Selector =
    Selector.from("#framelive");

  constructor(loadingSelector: Selector) {
    this.LOADING_SELECTOR = loadingSelector;
  }

  getDynamicallyGeneratedUrlAndVisit(): void {
    cy.log(`retrieving the unique session urland visiting it.`);

    this.DYNAMICALLY_URL_SELECTOR.retrieve()
      .its("0.src")
      .then((dynamicUrl) => {
        if (dynamicUrl) {
          cy.wrap(dynamicUrl).as("dynamicUrl")
        } else {
          throw new Error("dynamic url not generated?")
        }
      });
  }

  public assertElementIsLoaded(timeout: number): void {
    cy.log(`found a loading element, waiting ${timeout}s to load finish.`);

    this.LOADING_SELECTOR.retrieveWithTimeout(timeout)
      .should("not.be.visible")
      .then(() => {
        cy.log("loading element finished.");
        this.getDynamicallyGeneratedUrlAndVisit();
      });
  }
}
