import { test, expect } from '../../fixtures/test.fixture';
import { StringUtil } from '../../utils';
import { getActiveEnv } from '../../config/env.config';

/**
 * API practice app: ReqRes (https://reqres.in)
 * Skipped when ENV=local (use dummy-app.api.spec.ts instead)
 */
test.describe('Users API @api @smoke', () => {
  test.skip(getActiveEnv() === 'local', 'ReqRes suite — use ENV=qa/staging/prod');

  test('GET /users returns paginated list', async ({ usersApi }) => {
    const response = await usersApi.listUsers(1);
    await usersApi.expectStatus(response, 200);

    const body = await usersApi.getJson<{ page: number; data: unknown[] }>(response);
    expect(body.page).toBe(1);
    expect(body.data.length).toBeGreaterThan(0);
  });

  test('GET /users/:id returns a single user', async ({ usersApi }) => {
    const response = await usersApi.getUser(2);
    await usersApi.expectStatus(response, 200);

    const body = await usersApi.getJson<{ data: { id: number; email: string } }>(response);
    expect(body.data.id).toBe(2);
    expect(body.data.email).toContain('@');
  });

  test('POST /users creates a user', async ({ usersApi }) => {
    const payload = {
      name: `Auto ${StringUtil.randomAlpha(5)}`,
      job: 'QA Engineer',
    };

    const response = await usersApi.createUser(payload);
    await usersApi.expectStatus(response, 201);

    const body = await usersApi.getJson<{ id: string; name: string; job: string; createdAt: string }>(response);
    expect(body.name).toBe(payload.name);
    expect(body.job).toBe(payload.job);
    expect(body.id).toBeTruthy();
    expect(body.createdAt).toBeTruthy();
  });

  test('PUT /users/:id updates a user', async ({ usersApi }) => {
    const response = await usersApi.updateUser(2, { name: 'Updated Name', job: 'Lead QA' });
    await usersApi.expectStatus(response, 200);

    const body = await usersApi.getJson<{ name: string; job: string; updatedAt: string }>(response);
    expect(body.name).toBe('Updated Name');
    expect(body.updatedAt).toBeTruthy();
  });

  test('DELETE /users/:id returns 204', async ({ usersApi }) => {
    const response = await usersApi.deleteUser(2);
    await usersApi.expectStatus(response, 204);
  });

  test('POST /login authenticates api admin user', async ({ usersApi, apiAdminUser }) => {
    const response = await usersApi.login({
      email: apiAdminUser.username,
      password: apiAdminUser.password,
    });
    await usersApi.expectStatus(response, 200);

    const body = await usersApi.getJson<{ token: string }>(response);
    expect(body.token).toBeTruthy();
  });
});
