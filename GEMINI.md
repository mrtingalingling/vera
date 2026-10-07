# Coding Agent Guide

> **Prototype note:** the phases and `agents-cli` commands below apply to the current Python (Google ADK) prototype. The server is moving to Rust (ADR-014, ADR-016); when the Phase 1 pipeline replaces the prototype, this guide will be rewritten. The design set in [`docs/vera.md`](./docs/vera.md) is the source of truth for what to build.

## Prerequisites

Install the CLI (one-time):
```bash
uv tool install google-agents-cli
```

---

## Development Phases

### Phase 1: Understand Requirements
Before writing any code, understand the project's requirements, constraints, and success criteria.

### Phase 2: Build and Implement
Implement agent logic in `app/`. Use `agents-cli playground` for interactive testing. Iterate based on user feedback.

### Phase 3: The Evaluation Loop (Main Iteration Phase)
Start with 1-2 eval cases, run `agents-cli eval generate`, then `agents-cli eval grade`, iterate by making changes and rerunning both commands until satisfied. Expect 5-10+ iterations. Once you have a baseline, reach for `agents-cli eval compare` (regression diffs), `agents-cli eval analyze` (cluster failure modes), and `agents-cli eval optimize` (auto-tune prompts). See the **Evaluation Guide** for metrics, dataset schema, LLM-as-judge config, and common gotchas.

### Phase 4: Pre-Deployment Tests
Run `uv run pytest tests/unit tests/integration`. Fix issues until all tests pass.

### Phase 5: Deploy to Dev
**Requires explicit human approval.** Run `agents-cli deploy` only after user confirms. See the **Deployment Guide** for details.

### Phase 6: Production Deployment
Ask the user: Option A (simple single-project) or Option B (full CI/CD pipeline with `agents-cli infra cicd`).

## Development Commands

| Command | Purpose |
|---------|---------|
| `agents-cli playground` | Interactive local testing |
| `uv run pytest tests/unit tests/integration` | Run unit and integration tests |
| `agents-cli eval dataset synthesize` | Synthesize multi-turn eval scenarios for your agent |
| `agents-cli eval generate` | Run agent on eval dataset, produce traces |
| `agents-cli eval grade` | Run agent evaluations on the traces |
| `agents-cli eval compare` | Compare two grade-results files (regression check) |
| `agents-cli eval analyze` | Cluster failure modes from grade results |
| `agents-cli eval metric list` | List built-in metrics available in the SDK |
| `agents-cli eval optimize` | Auto-tune agent prompts using eval data |
| `agents-cli lint` | Check code quality |
| `agents-cli infra single-project` | Set up project infrastructure (Terraform) |
| `agents-cli deploy` | Deploy to dev |
| `agents-cli scaffold enhance` | Add deployment target or CI/CD to project |
| `agents-cli scaffold upgrade` | Upgrade project to latest version |

---

## Operational Guidelines for Coding Agents

- **Code preservation**: Only modify code directly targeted by the user's request. Preserve all surrounding code, config values (e.g., `model`), comments, and formatting.
- **NEVER change the model** unless explicitly asked.
- **Model 404 errors**: Fix `GOOGLE_CLOUD_LOCATION` (e.g., `global` instead of `us-east1`), not the model name.
- **ADK tool imports**: Import the tool instance, not the module: `from google.adk.tools.load_web_page import load_web_page`
- **Run Python with `uv`**: `uv run python script.py`. Run `agents-cli install` first.
- **Stop on repeated errors**: If the same error appears 3+ times, fix the root cause instead of retrying.
- **Terraform conflicts** (Error 409): Use `terraform import` instead of retrying creation.

---

## 🌐 Multi-Repo Ecosystem Guidelines (Vera, ClearCloud, Veracities.bet)

When working across the three repositories (`mrtingalingling/vera`, `mrtingalingling/clearCloud`, `mrtingalingling/veracities.social`), AI agents must follow these rules:

1. **Product boundaries (ADR-001)**:
   - **`vera`**: a standalone AI verification agent: pipeline, public API, SDK, web components, and the Chrome extension. **NEVER make Vera depend on ClearCloud or Veracities.bet**, and never let a wager, ruling, or market outcome feed back into a Vera verdict (ADR-010).
   - **`clearCloud`**: the social network, the Courtroom (challenges, panels, rulings), probation, and DAO governance. **NEVER add wagers to ClearCloud**; its only outcome-linked money is the refund-or-forfeit probation bond (ADR-011).
   - **`veracities.social`**: the Veracities.bet Validation Market only: markets on ruling outcomes, settlement, and the rake. **NEVER add panels, juries, or governance to veracities.social.**
   - Products integrate only through Vera's public SDK and API and public protocol records, never private databases or internal calls.
2. **Svelte 5 Runes Invariant**:
   - Use `$state`, `$derived`, `$derived.by`, `$effect`, and `$props`.
   - **NEVER import legacy Svelte 3/4 stores** (`writable`, `derived`) or write `$:` reactive declarations into components.
3. **Backends and contracts**:
   - New backend code in all three repos is Rust by default (ADR-014, ADR-016); frontends stay Svelte and TypeScript, and smart contracts stay Solidity.
   - Governance and Courtroom contracts are moving from `veracities.social/contracts/` to `clearCloud` (ticket C-012); `ValidationMarket.sol` stays in `veracities.social`. Until C-012 lands, recompile with `npm run compile:contracts` after any Solidity change so `src/config/contracts.json` stays in sync.
4. **Tests**:
   - Run each repo's own tests after changing it: `npm test` in each repo, and `uv run pytest tests/unit tests/integration` for Vera's Python prototype.
   - Never write test counts into documentation.
5. **How to change code**:
   - Follow the reviewable-diffs skill in `.agents/skills/reviewable-diffs/`: minimal diffs, no formatting churn, no invented features.
   - Every ticket has a reviewer other than its author.
   - Every documented feature carries exactly one status: Proposed, Confirmed, Prototyped, or Audited, and a doc may only claim a status the code supports.
   - Never commit resource IDs, keys, or project names; use environment variables and placeholders.
6. **Authoritative specification**:
   - For Vera, the design set in [**`docs/vera.md`**](./docs/vera.md) is the single source of truth: brief, pipeline, API, ADRs, tickets, and security plan.
   - Cross-product rules (money flows, ADR-001, ADR-010, ADR-016) live in the Ecosystem document in the `clearCloud` repo; ClearCloud's and Veracities.bet's own designs live in their repos.


## 🎫 Ticket Execution Rules (all coding agents)

These rules are written for Gemini 3.8 Flash as the baseline, so any ticket, including one assigned to Claude Opus 5.5, can be finished safely by Gemini if Opus isn't available. Every other model follows them too. They exist because a model that drifts out of scope or guesses produces diffs no one can review.

### 1. Before writing any code

1. **One ticket per session.** Read the ticket's row in [`docs/vera.md`](./docs/vera.md) (ticket, acceptance criteria, model, reviewer, dependencies) and every section, ADR, and endpoint it cites. Re-read them when the session resumes; don't rely on memory of an earlier session.
2. **Check dependencies.** If any ticket in "Depends on" isn't merged, stop and report it.
3. **Write a plan and wait.** Post a short plan before editing anything:
   - each acceptance criterion as a checkbox, with the test that will prove it
   - every file you expect to touch, and why
   - for any branching logic, the truth table you'll implement
   - anything unclear or in conflict with the design set, phrased as a question

   Don't start until a human (or the ticket's reviewer) approves the plan. If the plan needs more than about ten files or 400 changed lines, propose splitting the ticket instead.
4. **Never guess.** If a criterion, name, or behavior isn't in the design set, ask. "The design doesn't say" is a valid answer to report; inventing an answer isn't.

### 2. Scope

- Touch only the files in the approved plan. If you discover you need another file, stop and update the plan first.
- No renames, reformatting, dependency upgrades, or "while I'm here" fixes. Note unrelated problems in the PR description instead.
- Never invent features, endpoints, config keys, statuses, or verdict values that aren't in the design set. The six verdicts, the status vocabulary, and the API in `docs/vera.md` are fixed unless an ADR changes them.
- Never change which AI model the code calls, and never add a dependency, unless the ticket says so.

### 3. Making the change

- Follow the reviewable-diffs skill in `.agents/skills/reviewable-diffs/`: minimal diff, the truth table from the plan, and a test for each acceptance criterion.
- Work in small steps: change, run the relevant tests, then continue. Don't stack several untested changes.
- Never print, log, or echo keys, tokens, or personal data, including in tests, fixtures, and debug output.
- Never disable, skip, or weaken a failing test to make it pass. Report it instead.

### 4. Finishing

- Run the repo's tests (`npm test`, plus `uv run pytest tests/unit tests/integration` for Vera's Python prototype) and fix failures your change caused.
- Open a PR whose description includes: each acceptance criterion mapped to the test that proves it; the files changed; anything left undone or uncertain; and which model wrote it.
- Don't mark the ticket done; the reviewer does.

### 5. Extra rules when Gemini 3.8 Flash takes a Claude Opus 5.5 ticket

Opus tickets are the schema, security, and cross-cutting ones, where a wrong choice is expensive to undo. When Gemini finishes one:

- Use **high** thinking for the whole ticket.
- The plan must also list which ADRs the change touches and confirm it follows each one. Any change to a schema, a public API shape, a signature format, or a security boundary needs explicit human approval before coding, even if it seems implied.
- Split the work into the smallest mergeable PRs, each with its own tests.
- The reviewer must be a human, never Gemini reviewing its own model's work. Tickets whose listed reviewer is Claude Opus 5.5 also fall back to a human reviewer while Opus is unavailable.
- Note "Opus ticket, completed by Gemini 3.8 Flash" at the top of the PR.

### 6. Model notes

- **Gemini 3.8 Flash:** high thinking for reviews, security work, and Opus tickets; medium for routine implementation (minimal isn't supported). If it proposes a broader refactor than the ticket asks for, reject it and restate the scope. As a reviewer, it reports pass or fail for each acceptance criterion, citing the line in the diff, rather than general impressions.
- **Qwen3.8-27B (local, MLX):** one file, the exact function or lines to change, and the expected result; ask for a unified diff only, with a low temperature (0 to 0.2). If the change needs more than one file or any design judgment, hand the ticket back for reassignment. Its tickets are reviewed by Gemini 3.8 Flash or a human.
- **Documentation tickets** go to Claude Opus 5.5 or a human only, and never fall back to Gemini 3.8 Flash or Qwen.
