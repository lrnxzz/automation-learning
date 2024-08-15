import Selector from "@/src/selector/selector";

describe('Extract Products from PrestaShop Demo', () => {
  const featuredProductsSelector = Selector.from('.featured-products');

  it('should extract and log products from featured-products section', () => {
    // Visit the page
    cy.visit('https://demo.prestashop.com/#/en/front');
    cy.wait(25000);

    cy.get('.featured-products').should('be.visible');
  });
});