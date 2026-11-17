---
name: playwright-mcp-explore
description: >-
  Explores a live web app with Playwright MCP, captures stable locators, and
  scaffolds or updates Page Objects and specs in this framework. Use when the
  user asks to explore UI, discover selectors, record a flow with MCP, or
  generate POM from the browser.
---

# Playwright MCP explore → POM

## Goal

Drive the real browser via MCP, then write durable Page Objects + specs (not one-off scripts left only in chat).

## Workflow

```
Progress:
- [ ] 1. Confirm ENV / URL (qa Sauce Demo vs local dummy)
- [ ] 2. Navigate + snapshot
- [ ] 3. Execute user journey with MCP tools
- [ ] 4. List locators (priority: role/label/test-id)
- [ ] 5. Update pages/ + fixtures if new page
- [ ] 6. Write/adjust tests/ui spec
- [ ] 7. Run chromium project for that spec
```

## Rules while exploring

1. Prefer `browser_snapshot` over screenshots for actions.
2. After each navigation, snapshot again before clicking.
3. Capture URL regexes for `waitForUrl` / `expectLoaded`.
4. For forms, prefer `browser_fill_form` then snapshot validation messages.
5. Use `browser_network_requests` when the ticket implies API-backed UI.

## Code generation contract

```ts
// pages/feature.page.ts — locators in constructor, intent methods only
export class FeaturePage extends BasePage {
  readonly submitBtn: Locator;
  constructor(page: Page) {
    super(page);
    this.submitBtn = page.getByRole('button', { name: 'Submit' });
  }
  async submit(): Promise<void> {
    await this.click(this.submitBtn);
  }
}
```

- Register new pages in `fixtures/test.fixture.ts`
- Specs call page methods only
- Users/data from env JSON

## Local dummy app

```bash
npm run dummy:serve
# or ENV=local so Playwright webServer starts it
```

Base: `http://127.0.0.1:4173`

## Done when

- [ ] Happy path reproducible via MCP
- [ ] Page object methods cover the flow
- [ ] Spec passes on `--project=chromium`
