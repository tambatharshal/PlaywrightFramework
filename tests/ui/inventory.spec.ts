import { test, expect } from '../../fixtures/test.fixture';

test.describe('Inventory @ui', () => {
  test.beforeEach(async ({ loginPage, inventoryPage, standardUser }) => {
    await loginPage.open();
    await loginPage.login(standardUser.username, standardUser.password);
    await inventoryPage.expectLoaded();
  });

  test('can add product to cart', async ({ inventoryPage }) => {
    await inventoryPage.addProductByName('Sauce Labs Backpack');
    expect(await inventoryPage.getCartCount()).toBe(1);
  });

  test('can sort products by name Z to A', async ({ inventoryPage, page }) => {
    await inventoryPage.sortBy('za');
    const names = await page.locator('.inventory_item_name').allInnerTexts();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('can logout from inventory', async ({ inventoryPage, loginPage }) => {
    await inventoryPage.logout();
    await expect(loginPage.loginButton).toBeVisible();
  });
});
