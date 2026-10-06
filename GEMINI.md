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
