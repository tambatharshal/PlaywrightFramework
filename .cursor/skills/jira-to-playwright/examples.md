# Examples

## Example A — UI story → POM test

**User:** `Generate Playwright test for SAUCE-101`

**Agent:**

1. `getJiraIssue` → AC: “standard user logs in and sees Products”
2. Playwright MCP: navigate Sauce Demo → snapshot login → fill → snapshot inventory
3. Reuse `LoginPage` / `InventoryPage` (or add missing methods)
4. Spec:

```ts
import { test, expect } from '../../fixtures/test.fixture';

test.describe('SAUCE-101 Login @ui @smoke', () => {
  test('SAUCE-101: standard user can login successfully', async ({
    loginPage,
    inventoryPage,
    standardUser,
  }) => {
    await loginPage.open();
    await loginPage.login(standardUser.username, standardUser.password);
    await inventoryPage.expectLoaded();
    expect(await inventoryPage.getProductCount()).toBeGreaterThan(0);
  });
});
```

5. Run: `npx playwright test --grep SAUCE-101`
6. Comment on SAUCE-101 with file path + command

## Example B — API story

**User:** `Automate REQ-55 create user API`

1. Read Jira AC (method, path, status 201, body fields)
2. Extend `UsersApi` if needed
3. Spec under `tests/api/` using `usersApi` fixture + `StringUtil` for unique names
4. Run `--project=api --grep REQ-55`

## Example C — Explore then author (no Jira yet)

**User:** `Use Playwright MCP on local dummy app and add checkout test`

1. `ENV=local` / navigate `http://127.0.0.1:4173`
2. Snapshot each step of checkout
3. Align locators with existing checkout pages
4. Add/adjust `tests/ui/checkout.spec.ts`
