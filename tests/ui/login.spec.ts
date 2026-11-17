import { test, expect } from '../../fixtures/test.fixture';

/**
 * UI practice app: Sauce Demo (https://www.saucedemo.com)
 */
test.describe('Login @ui @smoke', () => {
  test('standard user can login successfully', async ({ loginPage, inventoryPage, standardUser }) => {
    await loginPage.open();
    await loginPage.login(standardUser.username, standardUser.password);
    await inventoryPage.expectLoaded();
    expect(await inventoryPage.getProductCount()).toBeGreaterThan(0);
  });

  test('locked out user sees error message', async ({ loginPage, lockedUser }) => {
    await loginPage.open();
    await loginPage.login(lockedUser.username, lockedUser.password);
    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorText()).toContain('locked out');
  });

  test('invalid credentials show error', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login('invalid_user', 'wrong_password');
    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorText()).toContain('Username and password do not match');
  });
});
