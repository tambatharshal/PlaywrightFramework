# Agent notes — Playwright Standard Framework

- Prefer POM: put selectors in `pages/`, API calls in `api/`, assertions in `tests/`.
- Always load config/users via `config/env.config.ts` (`getEnvConfig`, `getUser`).
- New env = new `config/<env>.env.json` + `data/users/<env>.users.json` + update `EnvironmentName`.
- Import `test`/`expect` from `fixtures/test.fixture.ts` for UI/API specs.
- Practice apps: Sauce Demo + ReqRes (`ENV=qa`), local dummy shop (`ENV=local` → `dummy-app/`).
- Checkout flow pages: `checkout-info`, `checkout-overview`, `checkout-complete`.
- Allure: results in `allure-results/`; open with `npm run allure:report`.
- Do not commit real production secrets; use `.env` / CI secrets for `DB_*`.

## Jira + Playwright MCP

- Setup/train: skill `train-jira-playwright-mcp` (see `.cursor/skills/`).
- Ticket → tests: skill `jira-to-playwright` (Atlassian MCP + Playwright MCP).
- Explore UI: skill `playwright-mcp-explore`.
- MCP config: `.cursor/mcp.json`. Rules: `jira-playwright-mcp.mdc`, `playwright-mcp-usage.mdc`.
- Put Jira keys in test titles; never invent acceptance criteria.
