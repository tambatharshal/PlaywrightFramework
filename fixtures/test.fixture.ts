import { test as base, APIRequestContext } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutInfoPage } from '../pages/checkout-info.page';
import { CheckoutOverviewPage } from '../pages/checkout-overview.page';
import { CheckoutCompletePage } from '../pages/checkout-complete.page';
import { UsersApi } from '../api/users.api';
import { ProductsApi } from '../api/products.api';
import { getEnvConfig, getUser, UserCredentials, EnvConfig } from '../config/env.config';

type Pages = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutInfoPage: CheckoutInfoPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
};

type ApiClients = {
  usersApi: UsersApi;
  productsApi: ProductsApi;
};

type Helpers = {
  envConfig: EnvConfig;
  standardUser: UserCredentials;
  lockedUser: UserCredentials;
  apiAdminUser: UserCredentials;
};

/**
 * Custom fixtures — inject POM pages, API clients, and env users into every test
 */
export const test = base.extend<Pages & ApiClients & Helpers>({
  envConfig: async ({}, use) => {
    await use(getEnvConfig());
  },

  standardUser: async ({}, use) => {
    await use(getUser('standard'));
  },

  lockedUser: async ({}, use) => {
    await use(getUser('locked'));
  },

  apiAdminUser: async ({}, use) => {
    await use(getUser('apiAdmin'));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutInfoPage: async ({ page }, use) => {
    await use(new CheckoutInfoPage(page));
  },

  checkoutOverviewPage: async ({ page }, use) => {
    await use(new CheckoutOverviewPage(page));
  },

  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },

  usersApi: async ({ request }, use) => {
    await use(new UsersApi(request));
  },

  productsApi: async ({ request }, use) => {
    await use(new ProductsApi(request));
  },
});

export { expect } from '@playwright/test';
export type { APIRequestContext };
