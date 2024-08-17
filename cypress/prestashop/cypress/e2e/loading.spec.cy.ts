import LoadingElement from "@/src/element/loading.element";
import Selector from "@/src/selector/selector";

describe('Feature: PrestaShop Demo Site Loading', () => {
  const setupSession = () => {
    const loadingElement = new LoadingElement(Selector.from('#loadingMessage'));
    cy.visit('https://demo.prestashop.com/#/en/front');
    loadingElement.assertElementIsLoaded(100000);
    
    cy.url().then(url => {
      Cypress.env('savedUrl', url); 
    });
  };

  beforeEach(() => {
    cy.session('prestashop-demo', setupSession);
    
    cy.then(() => {
      const savedUrl = Cypress.env('savedUrl');
      if (savedUrl) {
        cy.visit(savedUrl);
      } else {
        cy.log('No saved URL found. Visiting default URL.');
        cy.visit('https://demo.prestashop.com/#/en/front');
      }
    });
  });

  it('Given the user navigates to the PrestaShop demo site', () => {
    cy.url().should('eq', Cypress.env('savedUrl'));
  });

  it('When the loading screen appears', () => {
    cy.get('#wrapper').should('be.visible');
  });

  it('Then the demo store should be visible', () => {
    cy.get('header').should('be.visible');
    cy.get('footer').should('be.visible');
    cy.get('#content').should('be.visible');
    cy.get('#top-menu').should('be.visible');
  });

  it('And the user should see the fully loaded PrestaShop demo site', () => {
    cy.get('#wrapper').should('be.visible');
    cy.get('header').should('be.visible');
    cy.get('footer').should('be.visible');
    cy.get('#content').should('be.visible');
    cy.get('#top-menu').should('be.visible');
  });
});
