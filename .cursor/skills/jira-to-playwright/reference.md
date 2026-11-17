# Jira + Playwright MCP reference

## Atlassian MCP (Jira)

| Tool | Use for |
|------|---------|
| `getAccessibleAtlassianResources` | Resolve `cloudId` |
| `getVisibleJiraProjects` | List projects |
| `getJiraIssue` | Full issue + fields |
| `searchJiraIssuesUsingJql` | Backlog / sprint queries |
| `getJiraIssueTypeMetaWithFields` | Required fields before create/edit |
| `createJiraIssue` | New bug/story from failed test (ask first) |
| `editJiraIssue` | Update labels / description |
| `addCommentToJiraIssue` | Post automation links / results |
| `getTransitionsForJiraIssue` | Valid status transitions |
| `transitionJiraIssue` | Move ticket (only if user asks) |
| `lookupJiraAccountId` | Assignee lookup |

### Useful JQL examples

```
project = PROJ AND sprint in openSprints() AND type = Story
project = PROJ AND key = PROJ-123
project = PROJ AND labels = automation AND status != Done
text ~ "login" AND project = PROJ ORDER BY updated DESC
```

## Playwright MCP

| Tool | Use for |
|------|---------|
| `browser_navigate` | Open URL |
| `browser_snapshot` | A11y tree → locators |
| `browser_take_screenshot` | Visual evidence (not for clicking) |
| `browser_click` / `browser_type` / `browser_fill_form` | Drive flows |
| `browser_select_option` | Dropdowns |
| `browser_wait_for` | Text appear/disappear |
| `browser_network_requests` | Discover API calls during UI |
| `browser_console_messages` | Client errors |
| `browser_tabs` | Multi-tab flows |

## Framework mapping

| Artifact | Path |
|----------|------|
| Env | `config/<env>.env.json` |
| Users | `data/users/<env>.users.json` |
| Pages | `pages/` |
| API clients | `api/` |
| Fixtures | `fixtures/test.fixture.ts` |
| UI specs | `tests/ui/` |
| API specs | `tests/api/` |

## MCP enablement (Cursor)

Project file: `.cursor/mcp.json` (committed example without secrets).

User must authenticate Atlassian MCP in Cursor Settings → MCP when prompted.
