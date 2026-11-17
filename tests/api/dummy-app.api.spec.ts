import { test, expect } from '../../fixtures/test.fixture';
import { getActiveEnv } from '../../config/env.config';

/**
 * Runs only against the local dummy-app API (ENV=local)
 */
test.describe('Dummy App API @api @local', () => {
  test.skip(getActiveEnv() !== 'local', 'Requires ENV=local and dummy-app server');

  test('POST /login returns token for standard user', async ({ productsApi, standardUser }) => {
    const response = await productsApi.login(standardUser.username, standardUser.password);
    await productsApi.expectStatus(response, 200);
    const body = await productsApi.getJson<{ token: string; username: string }>(response);
    expect(body.token).toContain('token-');
    expect(body.username).toBe(standardUser.username);
  });

  test('GET /products returns catalog', async ({ productsApi }) => {
    const response = await productsApi.listProducts();
    await productsApi.expectStatus(response, 200);
    const body = await productsApi.getJson<{ data: Array<{ name: string }> }>(response);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data.some((p) => p.name.includes('Backpack'))).toBeTruthy();
  });

  test('POST /orders creates an order', async ({ productsApi }) => {
    const response = await productsApi.createOrder({
      items: [{ id: 1, name: 'Sauce Labs Backpack', price: 29.99 }],
      customer: { firstName: 'Harshal', lastName: 'Tambat', postalCode: '411001' },
    });
    await productsApi.expectStatus(response, 201);
    const body = await productsApi.getJson<{ id: string; status: string }>(response);
    expect(body.id).toMatch(/^ORD-/);
    expect(body.status).toBe('confirmed');
  });
});
