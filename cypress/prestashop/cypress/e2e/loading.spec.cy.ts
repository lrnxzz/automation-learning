import LoadingElement from "@/src/element/loading.element";
import Selector from "@/src/selector/selector";

const loadingElement = new LoadingElement(Selector.from('#loadingMessage'));

describe('Feature: PrestaShop Demo Site Loading', () => {

  before(() => {
    cy.visit('https://demo.prestashop.com/#/en/front');
    loadingElement.assertElementIsLoaded(100);
  });

  beforeEach(() => {
    loadingElement.getDynamicallyGeneratedUrlAndVisit();

    cy.get('@dynamicUrl').then((dynamicUrl) => {
      const url = dynamicUrl.toString();
      cy.visit(url);
    });
  });

  it('Given the user navigates to the PrestaShop demo site', () => {
    cy.get('@dynamicUrl').then((dynamicUrl) => {
      const url = dynamicUrl.toString();
      cy.url().should('eq', url);
    });
  });

  it('When the loading screen appears and disappears', () => {
    cy.get('#loadingMessage', { timeout: 100000 }).should('not.be.visible');
  });

  it('Then the demo store should be visible', () => {
    cy.get('#wrapper').should('be.visible');
  });
});
