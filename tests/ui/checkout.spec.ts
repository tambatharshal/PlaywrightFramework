import { test, expect } from '../../fixtures/test.fixture';

test.describe('Checkout flow @ui @smoke', () => {
  test.beforeEach(async ({ loginPage, inventoryPage, standardUser }) => {
    await loginPage.open();
    await loginPage.login(standardUser.username, standardUser.password);
    await inventoryPage.expectLoaded();
  });

  test('completes end-to-end purchase', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
    page,
  }) => {
    await inventoryPage.addProductByName('Sauce Labs Backpack');
    await inventoryPage.addProductByName('Sauce Labs Fleece Jacket');
    expect(await inventoryPage.getCartCount()).toBe(2);

    await page.locator('.shopping_cart_link').click();
    await cartPage.expectLoaded();
    await cartPage.checkout();

    await checkoutInfoPage.expectLoaded();
    await checkoutInfoPage.fillAndContinue('Harshal', 'Tambat', '411001');

    await checkoutOverviewPage.expectLoaded();
    const names = await checkoutOverviewPage.getItemNames();
    expect(names).toContain('Sauce Labs Backpack');
    expect(names).toContain('Sauce Labs Fleece Jacket');
    await checkoutOverviewPage.finish();

    await checkoutCompletePage.expectLoaded();
    await expect(checkoutCompletePage.completeText).toContainText('Your order has been dispatched');
  });

  test('shows error when checkout info is empty', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    page,
  }) => {
    await inventoryPage.addProductByName('Sauce Labs Onesie');
    await page.locator('.shopping_cart_link').click();
    await cartPage.expectLoaded();
    await cartPage.checkout();

    await checkoutInfoPage.expectLoaded();
    await checkoutInfoPage.continue();
    await expect(checkoutInfoPage.errorMessage).toBeVisible();
    expect(await checkoutInfoPage.errorMessage.innerText()).toContain('First Name is required');
  });
});
