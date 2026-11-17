import { test, expect } from '../../fixtures/test.fixture';

test.describe('Cart @ui', () => {
  test.beforeEach(async ({ loginPage, inventoryPage, standardUser }) => {
    await loginPage.open();
    await loginPage.login(standardUser.username, standardUser.password);
    await inventoryPage.expectLoaded();
  });

  test('cart shows added products', async ({ inventoryPage, cartPage, page }) => {
    await inventoryPage.addProductByName('Sauce Labs Bike Light');
    await inventoryPage.addProductByName('Sauce Labs Bolt T-Shirt');
    await page.locator('.shopping_cart_link').click();
    await cartPage.expectLoaded();

    const names = await cartPage.getItemNames();
    expect(names).toContain('Sauce Labs Bike Light');
    expect(names).toContain('Sauce Labs Bolt T-Shirt');
    expect(names).toHaveLength(2);
  });
});
