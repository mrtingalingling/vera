# Coding Agent Guide

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

## 🌐 Multi-Repo Ecosystem Guidelines (Vera, ClearCloud, Veracities)

When working across the three repositories (`mrtingalingling/vera`, `mrtingalingling/clearCloud`, `mrtingalingling/veracities.social`), AI Agents must adhere to the following architectural laws:

1. **Strict Separation of Powers**:
   - **`vera`**: Client ingestion, Chrome MV3 extension, local on-device AI heuristics, and zero-leakage PII scrubbing.
   - **`clearCloud`**: Civic feed & Courtroom deliberation. **NEVER inject betting, market wagering, or token speculation into clearCloud**.
   - **`veracities.social`**: Prediction market staking, Truth Parleys, derivative hedges, oracle relayers, and Epistemic DAO governance. **NEVER inject judicial juror deliberation into veracities.social**.
2. **Svelte 5 Runes Invariant**:
   - Use `$state`, `$derived`, `$derived.by`, `$effect`, and `$props`.
   - **NEVER import legacy Svelte 3/4 stores** (`writable`, `derived`) or write `$:` reactive declarations into components.
3. **Smart Contract ABI & Address Synchronization**:
   - Solidity contracts live in `veracities.social/contracts/`.
   - Whenever editing Solidity contracts, recompile via `npm run compile:contracts` from root to ensure exported addresses in `src/config/contracts.json` remain in sync across both `veracities.social` and `clearCloud`.
4. **Mandatory Full Test Suite Verification**:
   - After modifying any code across the three repositories, run the root test suite:
     ```bash
     cd /config/Desktop && npm run test:all
     ```
   - Confirm that all 224 tests (68 clearCloud + 95 veracities + 42 vera frontend + 19 vera backend) pass before concluding work.
5. **Authoritative Specification**:
   - Detailed caveats, deployment steps, and upgrade warnings are maintained in [**`docs/ARCHITECTURE_CAVEATS_AND_ROADMAP.md`**](./docs/ARCHITECTURE_CAVEATS_AND_ROADMAP.md). Always consult this file as the single source of truth.
