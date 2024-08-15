import Selector from "../selector/selector";

/**
 * Represents a basic product with a name, price, and clickable thumbnail.
 */
export interface SimpleProduct {
  name: string;
  price: number;
  clickableThumbnail: JQuery<HTMLElement>;
}

/**
 * Extends SimpleProduct to include discount information.
 * Useful for promotions and special offers.
 */
export interface DiscountableProduct extends SimpleProduct {
  percentage: string;
  discountPrice: number;
}

/**
 * ProductBuilder: Facilitates the creation of SimpleProduct or DiscountableProduct instances.
 * 
 * This class allows for incremental configuration of product properties
 * before building the final object. It provides a flexible and readable way
 * to create products, especially useful when not all properties are known
 * at instantiation time.
 * 
 * Usage example:
 * 
 * const product = new ProductBuilder()
 *   .setName("Basic T-Shirt")
 *   .setPrice(29.99)
 *   .setClickableThumbnail($("<img src='tshirt.jpg'>"))
 *   .build();
 */
export class ProductBuilder {
  private name: string = "";
  private price: number = 0;
  private clickableThumbnail: JQuery<HTMLElement> | null = null;
  private percentage: string | undefined = undefined;
  private discountPrice: number | undefined = undefined;

  /**
   * Sets the product name.
   * @param name Product name
   */
  setName(name: string): ProductBuilder {
    this.name = name;
    return this;
  }

  /**
   * Sets the product price.
   * @param price Product price
   */
  setPrice(price: number): ProductBuilder {
    this.price = price;
    return this;
  }

  /**
   * Sets the clickable thumbnail for the product.
   * @param clickableThumbnail jQuery element representing the thumbnail
   */
  setClickableThumbnail(
    clickableThumbnail: JQuery<HTMLElement>
  ): ProductBuilder {
    this.clickableThumbnail = clickableThumbnail;
    return this;
  }

  /**
   * Sets the discount percentage for the product.
   * @param percentage Discount percentage as a string (e.g., "20%")
   */
  setPercentage(percentage: string): ProductBuilder {
    this.percentage = percentage;
    return this;
  }

  /**
   * Sets the discounted price for the product.
   * @param discountPrice Discounted price
   */
  setDiscountPrice(discountPrice: number): ProductBuilder {
    this.discountPrice = discountPrice;
    return this;
  }

  /**
   * Builds and returns the final product object.
   * 
   * If both percentage and discountPrice are set,
   * returns a DiscountableProduct. Otherwise, returns a SimpleProduct.
   * 
   * @returns SimpleProduct or DiscountableProduct
   */
  build(): SimpleProduct | DiscountableProduct {
    if (this.percentage && this.discountPrice) {
      return new DiscountedProduct(
        this.name,
        this.price,
        this.clickableThumbnail!,
        this.percentage,
        this.discountPrice
      );
    } else {
      return new SimpleProductImpl(
        this.name,
        this.price,
        this.clickableThumbnail!
      );
    }
  }
}

/**
 * Concrete implementation of SimpleProduct.
 */
class SimpleProductImpl implements SimpleProduct {
  constructor(
    public name: string,
    public price: number,
    public clickableThumbnail: JQuery<HTMLElement>
  ) {}
}

/**
 * Concrete implementation of DiscountableProduct.
 * Extends SimpleProductImpl and adds discount-related properties.
 */
class DiscountedProduct
  extends SimpleProductImpl
  implements DiscountableProduct
{
  constructor(
    name: string,
    price: number,
    clickableThumbnail: JQuery<HTMLElement>,
    public percentage: string,
    public discountPrice: number
  ) {
    super(name, price, clickableThumbnail);
  }
}