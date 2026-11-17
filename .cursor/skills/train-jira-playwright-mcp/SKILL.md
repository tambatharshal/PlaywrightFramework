---
name: train-jira-playwright-mcp
description: >-
  Onboards and trains the agent on integrating Jira (Atlassian MCP) with
  Playwright MCP and this POM framework. Use when the user asks how to set up,
  train, configure, or integrate Jira MCP and Playwright MCP, or wants a
  teaching walkthrough of the automation loop.
---

# Train: Jira + Playwright MCP integration

## What “training” means here

Cursor does not fine-tune a model on your Jira. You **train the agent with project context**:

1. **Rules** (always / glob) — constraints every chat must follow  
2. **Skills** — step-by-step workflows the agent reads on demand  
3. **MCP servers** — live tools to read Jira + drive the browser  
4. **This repo’s code patterns** — POM, fixtures, env JSON  

That combination makes the agent behave consistently for ticket → test generation.

## One-time setup checklist

```
Setup:
- [ ] 1. Enable MCP servers in Cursor
- [ ] 2. Authenticate Atlassian (Jira)
- [ ] 3. Verify Playwright MCP browser tools
- [ ] 4. Confirm project rules + skills exist
- [ ] 5. Run a dry-run on a sample ticket
```

### 1. Enable MCP

Project config: `.cursor/mcp.json`

- **Playwright**: `npx @playwright/mcp@latest` (stdio)
- **Atlassian**: hosted SSE URL — complete OAuth when Cursor prompts

Cursor: **Settings → MCP** → ensure both show connected / authenticated.

If Atlassian shows `needsAuth`, run the namespace `mcp_auth` flow from the agent.

### 2. Verify tools

Ask the agent (or run yourself via agent):

- Jira: `getVisibleJiraProjects` or `getJiraIssue` for a known key  
- Browser: `browser_navigate` to Sauce Demo or local dummy → `browser_snapshot`

### 3. Project knowledge already in repo

| Asset | Path | Role |
|-------|------|------|
| Framework rule | `.cursor/rules/playwright-framework.mdc` | POM / env |
| Jira+MCP rule | `.cursor/rules/jira-playwright-mcp.mdc` | Tool routing |
| MCP locators rule | `.cursor/rules/playwright-mcp-usage.mdc` | Selector priority |
| Skill: ticket → test | `.cursor/skills/jira-to-playwright/` | Main workflow |
| Skill: explore UI | `.cursor/skills/playwright-mcp-explore/` | Locator discovery |
| This skill | `.cursor/skills/train-jira-playwright-mcp/` | Onboarding |

### 4. Dry-run script (teach by doing)

Have the user pick a real or sample key, then:

1. Invoke skill **jira-to-playwright**
2. Fetch issue via Atlassian MCP  
3. Explore with Playwright MCP  
4. Generate/update page + spec  
5. `npx playwright test --grep <KEY>`  
6. Optional Jira comment with results  

## Daily usage phrases (triggers)

Teach the team to say:

- `Generate tests for PROJ-123 using Jira MCP`
- `Explore checkout on local dummy with Playwright MCP and update POM`
- `From Jira AC, add API test for PROJ-200`
- `Comment on PROJ-123 with automation file paths`

## Feedback loop (improve quality)

After each ticket automation:

1. If wrong locator → fix page object; note pattern in PR  
2. If wrong AC interpretation → tighten Jira AC templates (Given/When/Then)  
3. If missing user → add key to `data/users/<env>.users.json`  
4. Optionally add a short note under `jira-to-playwright/examples.md`

## Security

- Do not put API tokens inside skills/rules  
- Use Cursor MCP OAuth / user secrets  
- Mask passwords in Jira comments  

## Related skills

- Full ticket workflow → [jira-to-playwright/SKILL.md](../jira-to-playwright/SKILL.md)  
- UI exploration only → [playwright-mcp-explore/SKILL.md](../playwright-mcp-explore/SKILL.md)  
