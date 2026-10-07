# Agent Instructions

This file is for agent tools that read `AGENTS.md`. The full instructions, including product boundaries and the prototype setup, are in [`GEMINI.md`](./GEMINI.md); read it before starting. The ticket rules below are copied from it, so update both files together.

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
