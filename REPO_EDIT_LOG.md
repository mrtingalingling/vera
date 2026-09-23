# Repository Edit Log

## [2026-09-23] feat: Svelte 5 frame, 1-click BYOM agent uncap, mini-chart metrics & 4-category highlighting
- Branch: `feat/svelte5-byom-metrics`
- Scope: Upgrade frame to Svelte 5 runes, implement 1-click in-app BYOM agent uncap, add verifiable facts vs. opinion/speculation mini-chart, and support 4 DOM highlighting categories.
- Files modified:
  - `frontend/main.py`: Added 1-click in-app agent and Google OAuth support to `_query_byom_provider` and rate limit bypass in `/chat`; fixed `STATIC_DIR` resolution and made `RESOURCE` / Google credentials fallback gracefully in test/standalone environments.
  - `frontend/static/index.html`: Fixed runtime `ReferenceError: updateByomStatusDisplay is not defined`; fixed 1-click in-app agent connect button to persist uncapped settings; added Svelte 5 Cockpit launch button; added facts vs. opinion mini-chart view widget.
  - `extension/content.js`: Added styling, classes, and badge categorization for 4 verdict categories: `verified` (green), `disputed` (orange/amber), `misinformed` (red), and `need-additional-context` (purple).
  - `extension/popup.html`: Added facts vs. opinion mini-chart component view above the log stream.
  - `extension/popup.js`: Updated 1-click in-app agent connection handler to persist `one_click: true` and immediately reflect uncapped status badge without requiring external API keys; updated `loadBYOMSettings` and chat response handler.
  - `.gitignore`: Whitelisted `/frontend/static/dist/**` so compiled Svelte 5 bundle artifacts are preserved for deployment.
  - `tests/unit/test_auth_flow.py`: Replaced placeholder tests with unit tests for free tier rate limiting, 1-click BYOM uncap, custom API key bypass, and Google OAuth provider support.
  - `tests/unit/test_extension_parser.py`: Replaced mock tests with unit tests covering the 4 highlight categories (`verified`, `disputed`, `misinformed`, `need-additional-context`) and fallback.
  - `tests/unit/test_metrics.py`: Added unit tests for fact vs. opinion ratio calculation across fact-dominant, opinion-dominant, and zero/empty states.
- Files created:
  - `frontend/metrics.py`: Utility calculating verifiable facts vs. opinion/speculation ratio, percentages, and dominant category.
  - `frontend/extension_parser.py`: Helper classifying claim verdicts and confidence into standard DOM highlight categories and badges.
  - `frontend/package.json` & `frontend/package-lock.json`: Node package configuration with Svelte 5, Vite, and Vitest.
  - `frontend/vite.config.js`: Vite build configuration targeting `static/dist/frame.js` and `frame.css`.
  - `frontend/src/App.svelte`: Svelte 5 application frame component using runes (`$state`, `$derived`, `$effect`).
  - `frontend/src/components/Header.svelte`: Svelte 5 header with theme toggle, BYOM settings trigger, and uncapped query badge.
  - `frontend/src/components/MiniChart.svelte`: Svelte 5 reactive mini-chart visualization for verifiable facts vs. opinion/speculation.
  - `frontend/src/components/MiniChart.test.js`: Vitest unit tests covering mini-chart width and ratio calculations.
  - `frontend/src/components/ByomModal.svelte`: Svelte 5 modal facilitating 1-click frictionless agent connection and custom API keys.
  - `frontend/src/main.js`: Svelte 5 mount script.
  - `frontend/static/frame.html`: Standalone HTML page mounting the compiled Svelte 5 frame cockpit.
  - `frontend/static/dist/frame.js` & `frame.css`: Compiled Svelte 5 distribution bundle.
  - `REPO_EDIT_LOG.md`: Repository edit log per `reviewable-diffs` skill.
- Files deleted:
  - None.
- Untouched (deliberately preserved):
  - `app/agent.py` & `app/agent_engine_app.py`: Vertex AI Reasoning Engine backend logic and A2A integration left intact.
  - `extension/manifest.json`: Core Chrome extension permissions and background service worker left untouched.
- Tests added:
  - `tests/unit/test_auth_flow.py`: Covers free tier cap enforcement, 1-click BYOM uncap, and OAuth provider queries.
  - `tests/unit/test_extension_parser.py`: Covers 4 highlight categories and fallback.
  - `tests/unit/test_metrics.py`: Covers fact vs. opinion calculation and edge cases.
  - `frontend/src/components/MiniChart.test.js`: Covers mini-chart width and ratio calculations.
- Truth table:

| Row | Input State / Action | Condition | Expected Output / Behavior | Test Covering |
|---|---|---|---|---|
| 1 | Query submitted | Free tier, count < 15 | Query processed, counter decremented | `test_free_tier_under_limit` |
| 2 | Query submitted | Free tier, count >= 15 | Blocked with DAILY_RATE_LIMIT_EXCEEDED (remaining: 0) | `test_free_tier_at_limit_blocked` |
| 3 | Query submitted | BYOM 1-click connected | Allowed, remaining: 999 (uncapped) | `test_one_click_byom_uncaps_limit` |
| 4 | Query submitted | BYOM custom API key | Allowed, remaining: 999 (uncapped) | `test_custom_api_key_uncaps_limit` |
| 5 | BYOM query | Provider: google_oauth / one_click | Handled gracefully without Unsupported provider error | `test_google_oauth_provider_supported` |
| 6 | Metrics calculation | High accuracy (e.g. 85%) | High verifiable facts %, dominant: FACT | `test_metrics_ratio_predominantly_fact` |
| 7 | Metrics calculation | High hallucination/speculation (e.g. 90%) | High opinion/speculation %, dominant: OPINION/SPECULATION | `test_metrics_ratio_predominantly_opinion` |
| 8 | Metrics calculation | 0 / empty values | Safe fallback to 50/50, dominant: NEUTRAL, no division by 0 | `test_metrics_ratio_empty_or_zero` |
| 9 | Verdict highlight | "verified" / "true" | Category: verified, class: verifact-verdict-verified, badge: 🟢 VERIFIED FACT | `test_highlight_category_verified` |
| 10 | Verdict highlight | "disputed" / "contest" | Category: disputed, class: verifact-verdict-disputed, badge: 🟠 DISPUTED CLAIM | `test_highlight_category_disputed` |
| 11 | Verdict highlight | "misinformed" / "false" | Category: misinformed, class: verifact-verdict-misinformed, badge: 🔴 MISINFORMED / FALSE | `test_highlight_category_misinformed` |
| 12 | Verdict highlight | "need-additional-context" | Category: need-additional-context, class: verifact-verdict-context, badge: 🟣 NEEDS ADDITIONAL CONTEXT | `test_highlight_category_need_context` |
| 13 | Verdict highlight | Unknown verdict | Safe fallback to need-additional-context | `test_highlight_category_fallback` |
| 14 | MiniChart Component | High facts % | Renders green progress segment, FACT-GROUNDED badge | `MiniChart.test.js` Row 14 |
| 15 | MiniChart Component | High opinion % | Renders purple progress segment, OPINION / SPECULATION badge | `MiniChart.test.js` Row 15 |
| 16 | MiniChart Component | Empty / zero input | Safe width percentages (0%), no NaN | `MiniChart.test.js` Row 16 |

- Verification:
  - Python tests: `uv run pytest tests/unit` passed (15 passed in 0.53s).
  - Frontend tests: `npm run test` passed (3 passed in 0.38s).
  - Production build: `npm run build` compiled Svelte 5 successfully without errors.
