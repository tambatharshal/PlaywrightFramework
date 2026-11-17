# Cursor config for this framework

## Rules (`.cursor/rules/`)

| File | Applies | Purpose |
|------|---------|---------|
| `playwright-framework.mdc` | always | POM, env, fixtures |
| `pom-patterns.mdc` | `pages/`, `api/` | Page/API patterns |
| `test-standards.mdc` | `tests/**` | Spec standards |
| `jira-playwright-mcp.mdc` | always | Jira + Playwright MCP routing |
| `playwright-mcp-usage.mdc` | pages/tests | MCP locator discovery |

## Skills (`.cursor/skills/`)

| Skill | When to invoke |
|-------|----------------|
| `train-jira-playwright-mcp` | Setup / how to integrate & train |
| `jira-to-playwright` | Jira key → generate POM tests |
| `playwright-mcp-explore` | Explore UI → update pages/specs |

In chat: `@jira-to-playwright` or ask “generate tests for PROJ-123”.

## MCP (`.cursor/mcp.json`)

- **playwright** — browser automation for locator discovery  
- **atlassian** — Jira issues, comments, transitions  

Authenticate Atlassian under **Cursor Settings → MCP**.

## Recommended first training run

1. Open this repo in Cursor  
2. Confirm MCP servers are green  
3. Say: `Follow train-jira-playwright-mcp and dry-run jira-to-playwright on <KEY>`  
4. Review generated `pages/` + `tests/` and run Playwright  
