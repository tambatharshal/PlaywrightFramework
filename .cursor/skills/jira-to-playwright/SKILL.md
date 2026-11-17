---
name: jira-to-playwright
description: >-
  Turns a Jira issue into Playwright POM tests for this framework. Use when the
  user pastes a Jira key (e.g. PROJ-123), asks to generate tests from a ticket,
  acceptance criteria, or story, or mentions Atlassian/Jira MCP automation.
---

# Jira → Playwright tests

## When to use

User provides a Jira key, story, or “write automation for ticket …”.

## Workflow

Copy and track:

```
Progress:
- [ ] 1. Fetch Jira issue (AC, description, links)
- [ ] 2. Classify UI vs API vs both
- [ ] 3. Explore app with Playwright MCP (if UI)
- [ ] 4. Add/update Page Objects or API clients
- [ ] 5. Write spec(s) with fixtures + env users
- [ ] 6. Run targeted tests
- [ ] 7. Optional: comment Jira with paths + command
```

### 1. Fetch Jira

Use Atlassian MCP namespace `user-Atlassian-MCP-Server`:

1. `getAccessibleAtlassianResources` if cloudId unknown
2. `getJiraIssue` with the issue key (include description / custom AC fields)
3. If searching: `searchJiraIssuesUsingJql` with project-scoped JQL

Extract:

- Summary, issue type, status
- Acceptance criteria / description steps
- Test data hints (roles, env)
- Linked design / Confluence if needed via `getTeamworkGraphContext`

**Never invent AC** missing from the ticket — ask the user.

### 2. Classify

| Signal in ticket | Output |
|------------------|--------|
| UI screens, clicks, forms | `tests/ui/*.spec.ts` + `pages/` |
| REST endpoints, status codes | `tests/api/*.spec.ts` + `api/` |
| Both | Separate UI + API specs; shared fixtures |

### 3. Explore UI (Playwright MCP)

Namespace `user-playwright`:

1. `browser_navigate` → env `baseUrl` or path from ticket
2. `browser_snapshot` → stable locators
3. Walk the happy path (and one negative path if AC says so)
4. Note URL patterns for `expectLoaded` / `waitForUrl`

### 4. Implement in this repo

Follow existing patterns:

- Pages extend `BasePage`
- Specs use `fixtures/test.fixture.ts`
- Users via `standardUser` / `getUser('key')`
- Title format: `PROJ-123: <behavior>`
- Tags: `@smoke` for critical AC, `@regression` otherwise

### 5. Run

```bash
npx playwright test --project=chromium --grep PROJ-123
# or API:
npx playwright test --project=api --grep PROJ-123
```

### 6. Close the loop (optional)

`addCommentToJiraIssue` with:

- Spec + page file paths
- Run command
- Pass/fail summary

Only `transitionJiraIssue` if the user explicitly asks.

## Output checklist

- [ ] Locators validated via MCP snapshot (not guessed)
- [ ] No hardcoded credentials/URLs
- [ ] Jira key in test title
- [ ] Matches POM + fixture rules

## More detail

- Tool cheat sheet: [reference.md](reference.md)
- End-to-end example: [examples.md](examples.md)
