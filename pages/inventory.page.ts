import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Sauce Demo Inventory / Products Page Object
 */
export class InventoryPage extends BasePage {
  readonly title: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly productItems: Locator;
  readonly sortDropdown: Locator;
  readonly burgerMenu: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('.title');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.productItems = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.burgerMenu = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async expectLoaded(): Promise<void> {
    await this.waitForUrl(/inventory/);
    await expect(this.title).toHaveText('Products');
  }

  async getProductCount(): Promise<number> {
    return this.productItems.count();
  }

  async addProductByName(productName: string): Promise<void> {
    const item = this.page.locator('.inventory_item').filter({ hasText: productName });
    await this.click(item.locator('button'));
  }

  async getCartCount(): Promise<number> {
    if (!(await this.cartBadge.isVisible())) return 0;
    return Number(await this.cartBadge.innerText());
  }

  async sortBy(option: string): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async logout(): Promise<void> {
    await this.click(this.burgerMenu);
    await this.click(this.logoutLink);
  }
}
