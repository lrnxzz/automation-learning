import { DiscountableProduct, ProductBuilder, SimpleProduct } from "@/src/entity/product.entity";
import Selector from "@/src/selector/selector";

/**
 * Defines the selectors used to locate product elements on the page.
 * 
 * @interface ProductSelectors
 */
interface ProductSelectors {
    product: Selector;
    name: Selector;
    price: Selector;
    thumbnail: Selector;
    discount: Selector;
    discountPrice: Selector;
}

/**
 * Default selectors for locating product elements on the page.
 * 
 * @constant {ProductSelectors} defaultSelectors
 */
const defaultSelectors: ProductSelectors = {
    product: Selector.from('.js-product'),
    name: Selector.from('.product-title'),
    price: Selector.from('.price'),
    thumbnail: Selector.from('.product-thumbnail img'),
    discount: Selector.from('.discount-percentage'),
    discountPrice: Selector.from('.regular-price')
};

/**
 * Extracts product information from a given element and selectors.
 * 
 * This function uses the `ProductBuilder` to create either a `SimpleProduct` or
 * `DiscountableProduct` based on the extracted data.
 * 
 * @param {Selector} $element - The selector for the product element.
 * @param {ProductSelectors} selectors - The selectors to use for extracting product details.
 * @returns {Promise<SimpleProduct | DiscountableProduct>} A promise that resolves to a `SimpleProduct` or `DiscountableProduct`.
 */
async function extractProductInfo(
    $element: Selector,
    selectors: ProductSelectors
): Promise<SimpleProduct | DiscountableProduct> {
    const builder = new ProductBuilder();

    try {
        await Promise.all([
            $element.find(selectors.name).invoke('text').then(text => builder.setName(text.trim())),
            $element.find(selectors.price).invoke('text').then(text => {
                const price = parseFloat(text.replace(/[^\d.]/g, ''));
                if (!isNaN(price)) builder.setPrice(price);
            }),
            $element.find(selectors.thumbnail).then(thumbnail => builder.setClickableThumbnail(thumbnail)),
            $element.find(selectors.discount).invoke('text').then(text => {
                const percentage = text.trim();
                if (percentage) builder.setPercentage(percentage);
            }),
            $element.find(selectors.discountPrice).invoke('text').then(text => {
                const discountPrice = parseFloat(text.replace(/[^\d.]/g, ''));
                if (!isNaN(discountPrice)) builder.setDiscountPrice(discountPrice);
            })
        ]);
    } catch (error) {
        console.error('Error extracting product info:', error);
    }

    return builder.build();
}

/**
 * Cypress command to retrieve a list of products from a container element.
 * 
 * Uses the provided or default selectors to locate product elements and extract their information.
 * 
 * @param {Selector} containerSelector - The selector for the container that holds the products.
 * @param {Partial<ProductSelectors>} [customSelectors] - Optional custom selectors to override default ones.
 * @returns {Cypress.Chainable<SimpleProduct[]>} A Cypress chainable that resolves to an array of `SimpleProduct` objects.
 */
Cypress.Commands.add('getProducts', (containerSelector: Selector, customSelectors?: Partial<ProductSelectors>): Cypress.Chainable<SimpleProduct[]> => {
    const selectors = { ...defaultSelectors, ...customSelectors };
    return containerSelector.find(selectors.product).then($products =>
        Promise.all($products.toArray().map((element, index) => {
            const elementSelector = Selector.from(`${containerSelector.rawSelector} ${selectors.product.rawSelector}:eq(${index})`);
            return extractProductInfo(elementSelector, selectors);
        }))
    );
});

/**
 * Cypress command to retrieve a random product from a container element.
 * 
 * Uses the provided or default selectors to locate product elements and extract their information.
 * 
 * @param {Selector} containerSelector - The selector for the container that holds the products.
 * @param {Partial<ProductSelectors>} [customSelectors] - Optional custom selectors to override default ones.
 * @returns {Cypress.Chainable<SimpleProduct | DiscountableProduct>} A Cypress chainable that resolves to a `SimpleProduct` or `DiscountableProduct` object.
 */
Cypress.Commands.add('getRandomProduct', (containerSelector: Selector, customSelectors?: Partial<ProductSelectors>): Cypress.Chainable<SimpleProduct | DiscountableProduct> => {
    const selectors = { ...defaultSelectors, ...customSelectors };
    return containerSelector.find(selectors.product).then($products => {
        const randomIndex = Math.floor(Math.random() * $products.length);
        const randomSelector = Selector.from(`${containerSelector.rawSelector} ${selectors.product.rawSelector}:eq(${randomIndex})`);
        return extractProductInfo(randomSelector, selectors);
    });
});

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Retrieves a list of products from a container element.
             * 
             * @param {Selector} containerSelector - The selector for the container that holds the products.
             * @param {Partial<ProductSelectors>} [customSelectors] - Optional custom selectors to override default ones.
             * @returns {Chainable<SimpleProduct[]>} A Cypress chainable that resolves to an array of `SimpleProduct` objects.
             */
            getProducts(containerSelector: Selector, customSelectors?: Partial<ProductSelectors>): Chainable<SimpleProduct[]>;

            /**
             * Retrieves a random product from a container element.
             * 
             * @param {Selector} containerSelector - The selector for the container that holds the products.
             * @param {Partial<ProductSelectors>} [customSelectors] - Optional custom selectors to override default ones.
             * @returns {Chainable<SimpleProduct | DiscountableProduct>} A Cypress chainable that resolves to a `SimpleProduct` or `DiscountableProduct` object.
             */
            getRandomProduct(containerSelector: Selector, customSelectors?: Partial<ProductSelectors>): Chainable<SimpleProduct | DiscountableProduct>;
        }
    }
}
