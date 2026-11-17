# Playwright Standard Framework

UI + API automation with **Page Object Model (POM)**, multi-environment config, user JSON files, shared utils (Excel / DB / daily helpers), Cursor rules, and CI/CD pipelines.

## Practice applications (dummy)

| ENV | Layer | App | URL |
|-----|-------|-----|-----|
| `qa` / `staging` / `prod` | UI | Sauce Demo | https://www.saucedemo.com |
| `qa` / `staging` / `prod` | API | ReqRes | https://reqres.in/api |
| `local` | UI + API | Built-in dummy shop | http://127.0.0.1:4173 |

```bash
# Local dummy app (auto-started by Playwright when ENV=local)
npm run dummy:serve
# or just:
npm run test:local
```

## Folder structure

```
├── .cursor/rules/          # Cursor AI coding rules
├── .github/workflows/      # GitHub Actions CI
├── api/                    # API clients (extend BaseApi)
├── config/                 # <env>.env.json + env.config.ts loader
├── data/
│   ├── users/              # <env>.users.json credentials
│   └── test-data/          # Excel / JSON test data
├── fixtures/               # Custom Playwright fixtures
├── pages/                  # Page Objects (POM)
├── tests/
│   ├── ui/                 # UI specs
│   ├── api/                # API specs
│   └── utils/              # Util self-checks
├── utils/                  # Excel, DB, date, string, file, wait, assert
├── azure-pipelines.yml
├── Jenkinsfile
└── playwright.config.ts
```

## Quick start

```bash
npm install
npx playwright install
cp .env.example .env

# Run all (default ENV=qa)
npm test

# UI only / API only
npm run test:ui
npm run test:api

# Other environments
npm run test:staging
npm run test:prod
npm run test:local

# Allure report (after any test run)
npm run allure:report
```

---

## Allure reporting

Every run writes raw results to `allure-results/`.

```bash
npm test
npm run allure:generate   # builds allure-report/
npm run allure:open       # opens in browser
# or one shot:
npm run allure:report
```

CI uploads both `allure-results` and `allure-report` artifacts.

---

## How to handle different environments

### 1. What already exists

| File | Purpose |
|------|---------|
| `config/qa.env.json` | QA baseUrl, apiBaseUrl, timeouts, DB, feature flags |
| `config/staging.env.json` | Staging values |
| `config/prod.env.json` | Prod values |
| `config/local.env.json` | Local dummy-app URLs (`http://127.0.0.1:4173`) |
| `config/env.config.ts` | Loads the right JSON based on `ENV` |
| `.env` | Optional local overrides (`ENV=qa`, `DB_*`) |

`playwright.config.ts` reads `getEnvConfig()` so `baseURL` and timeouts always match the active env.

### 2. Switch environment at runtime

```bash
# npm scripts
npm run test:qa
npm run test:staging
npm run test:prod
npm run test:local

# or inline
cross-env ENV=staging npx playwright test
```

On Linux/macOS CI: `ENV=qa npx playwright test`

When `ENV=local`, Playwright starts `dummy-app/server.js` automatically via `webServer`.

### 3. Add a new environment (e.g. `uat`)

1. **Copy config**
   ```bash
   cp config/qa.env.json config/uat.env.json
   ```
   Edit URLs, timeouts, DB, and feature flags.

2. **Copy users**
   ```bash
   cp data/users/qa.users.json data/users/uat.users.json
   ```
   Update usernames/passwords for UAT.

3. **Register the name** in `config/env.config.ts`:
   ```ts
   export type EnvironmentName = 'qa' | 'staging' | 'prod' | 'local' | 'uat';
   const allowed: EnvironmentName[] = ['qa', 'staging', 'prod', 'local', 'uat'];
   ```

4. **Add npm script** in `package.json`:
   ```json
   "test:uat": "cross-env ENV=uat npx playwright test"
   ```

5. **Run**
   ```bash
   npm run test:uat
   ```

### 4. Override DB / secrets without editing JSON

Prefer CI secrets or local `.env`:

```env
ENV=qa
DB_HOST=my-db.company.com
DB_PORT=3306
DB_USER=automation
DB_PASSWORD=***
DB_NAME=qa_automation
```

`getEnvConfig()` merges these over `config/<env>.env.json`.

---

## How to handle different users (`*.users.json`)

### Layout

```
data/users/qa.users.json
data/users/staging.users.json
data/users/prod.users.json
```

Example:

```json
{
  "users": {
    "standard": {
      "username": "standard_user",
      "password": "secret_sauce",
      "role": "user",
      "email": "standard.qa@example.com"
    },
    "locked": { "...": "..." }
  }
}
```

### Usage in tests

```ts
import { test, expect } from '../../fixtures/test.fixture';

test('login', async ({ loginPage, inventoryPage, standardUser }) => {
  await loginPage.open();
  await loginPage.login(standardUser.username, standardUser.password);
  await inventoryPage.expectLoaded();
});
```

Or load by key:

```ts
import { getUser } from '../../config/env.config';
const admin = getUser('apiAdmin');
```

### Add a new user

1. Add a key under `users` in the relevant `data/users/<env>.users.json`
2. Optionally expose it as a fixture in `fixtures/test.fixture.ts`
3. Use the fixture / `getUser('yourKey')` in specs

---

## POM + fixtures

- Pages: `pages/*.page.ts` extend `BasePage`
- API: `api/*.api.ts` extend `BaseApi`
- Specs import `test` / `expect` from `fixtures/test.fixture.ts` so pages, APIs, and users are injected automatically

---

## Utils (daily helpers)

| Util | Use for |
|------|---------|
| `ExcelUtil` | Read/write `.xlsx` for data-driven tests |
| `DbUtil` | MySQL queries using env DB config |
| `DateUtil` | Today, add days, timestamps |
| `StringUtil` | Random email / alphanumeric |
| `FileUtil` | JSON read/write, dirs, copy |
| `WaitUtil` | Retry / waitUntil (prefer Playwright auto-wait) |
| `AssertUtil` | Shared assertion helpers |

```ts
import { ExcelUtil, StringUtil } from '../../utils';

const rows = ExcelUtil.readSheet('data/test-data/sample-products.xlsx', 'Products');
const email = StringUtil.randomEmail();
```

---

## CI/CD

| Platform | File |
|----------|------|
| GitHub Actions | `.github/workflows/playwright.yml` |
| GitLab CI/CD | `.gitlab-ci.yml` |
| Jenkins | `Jenkinsfile` |
| Azure DevOps | `azure-pipelines.yml` |

All pipelines set `CI=true` and `ENV` (default `qa`), install browsers, run projects, and publish HTML / JUnit artifacts.

Wire DB secrets in the pipeline provider (GitHub Secrets, Jenkins credentials, Azure variable groups) as `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.

---

## Cursor rules, skills & MCP (Jira + Playwright)

See [`.cursor/README.md`](.cursor/README.md) for the full map.

**Rules** (`.cursor/rules/`): framework + `jira-playwright-mcp.mdc` + `playwright-mcp-usage.mdc`

**Skills** (`.cursor/skills/`):

| Skill | Use for |
|-------|---------|
| `train-jira-playwright-mcp` | How to set up / train Jira + Playwright MCP |
| `jira-to-playwright` | Jira ticket → POM tests |
| `playwright-mcp-explore` | Live UI explore → locators / pages |

**MCP** (`.cursor/mcp.json`): Playwright browser MCP + Atlassian (Jira). Authenticate under Cursor → Settings → MCP.

Example prompt: `Generate Playwright tests for PROJ-123 using jira-to-playwright`.

---

## Useful commands

```bash
npm run test:headed      # headed browser
npm run test:debug       # Playwright inspector
npm run report           # open last HTML report
npm run codegen          # record selectors
npm run lint             # TypeScript check
```

Filter by tag:

```bash
npx playwright test --grep @smoke
```
