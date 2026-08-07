# Project instructions

<!-- polyharness:start -->
<!-- polyharness:agents-version 1 -->
## PolyHarness project contract

### Purpose

- Use the repository Harness to make bounded changes and produce current, admissible evidence.
- Treat this file as the project map; detailed rules remain in their canonical project-owned files.

### Project map

- `root`: path `.`; capabilities: web-ui.

### Commands

Workspace `root`:

- `setup`: `npm ci`
- `dev`: `npm run dev`
- `lint`: `npm run lint`
- `typecheck`: `npm run typecheck`
- `test`: `npm run test`
- `browser-test`: `npm run browser-test`
- `build`: `npm run build`
- `check`: `npm run typecheck && npm run test && npm run lint && npm run build && npm run design-check && npm run browser-test`

<!-- polyharness:commands-begin -->
{"root":{"browser-test":"npm run browser-test","build":"npm run build","check":"npm run typecheck && npm run test && npm run lint && npm run build && npm run design-check && npm run browser-test","dev":"npm run dev","lint":"npm run lint","setup":"npm ci","test":"npm run test","typecheck":"npm run typecheck"}}
<!-- polyharness:commands-end -->

### Boundaries

- Preserve explicit goals, constraints, non-goals, deliverables, public APIs, and user-owned content.
- Keep secrets out of repositories, prompts, examples, command output, and logs.
- Require explicit approval for destructive actions, protected writes, releases, migrations, and external side effects.
- Never update a managed project's language, framework, dependency, or lock-file versions.
- Workspace `root` approval boundaries: <undeclared>.

### Definition of done

- Run the smallest relevant project-owned checks after material changes.
- Run the configured final `check` command after the last material edit.
- Treat static configuration as at most `PRESENT`; only commands executed in the current run are `EXERCISED`.
- Report changed files, exercised checks, unverified areas, remaining risk, external effects, and recovery steps.
- Do not declare a goal achieved until every required criterion, constraint, and deliverable has current evidence.

### Knowledge references

- Workspace `root` `agentMap`: [AGENTS.md](AGENTS.md)

<!-- polyharness:knowledge-begin -->
{"root":{"agentMap":"AGENTS.md","architecture":null,"reliability":null,"security":null}}
<!-- polyharness:knowledge-end -->

<!-- polyharness:end -->
