import LoadingElement from "@/src/element/loading.element";
import Selector from "@/src/selector/selector";

describe('Feature: PrestaShop Demo Site Loading', () => {
  const loadingElement = new LoadingElement(Selector.from('#loadingMessage'));

  const setupSession = () => {
    cy.visit('https://demo.prestashop.com/#/en/front');
    loadingElement.assertElementIsLoaded(100000);
    cy.url().then(url => {
      Cypress.env('loadedUrl', url);
    });
  };

  before(() => {
    cy.session('prestashop-demo', setupSession);
  });

  beforeEach(() => {
    cy.session('prestashop-demo', setupSession);
    cy.visit('https://demo.prestashop.com/#/en/front', { timeout: 120000 });
  });

  it('Given the user navigates to the PrestaShop demo site', () => {
    cy.url().should('include', 'demo.prestashop.com');
  });

  it('When the loading screen element appears', () => {
    loadingElement.assertLoading();
  });

  it('Then the loading screen element should disappear after the site finishes loading', () => {
    loadingElement.assertFinished(100000);
  });
});