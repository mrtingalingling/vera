# Repository Edit Log

## [2026-09-23] feat: UX simplifications — keyboard shortcut, quick backend presets, toast alerts & accordion panels
- Branch: `feat/svelte5-byom-metrics`
- Scope: Implemented recommended UX simplifications:
  1. Global keyboard shortcut `Alt+Shift+H` in `extension/manifest.json` and `extension/background.js` for instant in-page claim highlighting.
  2. Quick presets for Custom Remote Backend URL in `ByomModal.svelte` (`Local (8080)`, `Ollama (11434)`, `Cloud Gateway`).
  3. Interactive feedback toast system (`toastMessage`) in `App.svelte` for premise updates, Google Drive document linking, catalog archiving, and BYOM activation.
  4. Auto-collapse accordion behavior ensuring mutually exclusive drawer states between Evidence Sources and Fact Catalog.
  5. Expanded Vitest unit tests in `frontend/src/components/Panels.test.js` to 20 total tests.
- Files modified:
  - `extension/manifest.json`: Added `commands` for `highlight_page_claims` with `Alt+Shift+H`.
  - `extension/background.js`: Implemented `chrome.commands.onCommand` listener extracting claims and sending `HIGHLIGHT_PAGE_CLAIMS` to the active tab.
  - `frontend/src/components/ByomModal.svelte`: Added quick preset buttons for `Local (8080)`, `Ollama (11434)`, and `Cloud Gateway` with active styling.
  - `frontend/src/App.svelte`: Added `toastMessage` state, `showToast` helper, slide-down toast UI component, and accordion drawer collapse.
  - `frontend/main.py`: Modernized system prompt from VeriFact AI to Vera.
  - `frontend/src/components/Panels.test.js`: Added 2 unit tests for URL presets and accordion behavior (20 Vitest unit tests passing).
- Tests added / updated:
  - 20 frontend Vitest tests + 19 backend Pytest tests all passing (39 tests total).

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

## [2026-09-23] feat: Unified Vite build (web + extension), frictionless Guest Agent preset & persistent/embedded mini-charts
- Branch: `feat/svelte5-byom-metrics`
- Scope:
  1. Unified Vite build syncing Svelte 5 bundle to both `frontend/static/dist/` and `extension/dist/`.
  2. Frictionless "Guest Agent / Google AI One-Click Session" preset for non-technical users requiring zero credentials, plus default Google Account OAuth fallback and other AI options.
  3. Persistent facts vs. opinion mini-chart in the frame header/sidebar dashboard AND embedded within every individual fact-check response card.
- Files modified:
  - `frontend/vite.config.js`: Added `syncToExtensionPlugin` hook on `closeBundle` to copy compiled bundles to `../extension/dist/` in lockstep with `static/dist/`.
  - `extension/popup.html`: Updated to mount the compiled Svelte 5 application via `#svelte-frame-root` linking to `dist/frame.js` and `dist/frame.css`.
  - `frontend/static/frame.html`: Updated asset links to relative `dist/frame.js` and `dist/frame.css` for universal host compatibility.
  - `frontend/src/components/ByomModal.svelte`: Added primary frictionless "Activate Guest Agent / Google AI One-Click Session" button (uncapped, zero credentials), Google Account OAuth login option, and DeepSeek / custom AI options.
  - `frontend/src/App.svelte`: Added persistent dashboard mini-chart in top frame area, embedded mini-chart in every agent response card, and Chrome extension active tab detection.
  - `frontend/metrics.py`: Added `analyze_claim_metrics` implementing text heuristics for speculative vs. factual wording.
  - `frontend/main.py`: Supported `"guest_agent"`, `"google_ai_session"`, and `"guest"` in `_query_byom_provider` and rate limit uncap check; attached `metrics` to `/chat` responses.
  - `.gitignore`: Whitelisted `!extension/dist/` and `!extension/dist/**`.
  - `tests/unit/test_auth_flow.py`: Added unit tests for guest agent preset and google ai session preset without credentials.
  - `tests/unit/test_metrics.py`: Added unit tests for speculative and factual text heuristic analysis in `analyze_claim_metrics`.
- Tests added:
  - `test_guest_agent_preset_without_credentials` in `tests/unit/test_auth_flow.py`
  - `test_google_ai_session_preset` in `tests/unit/test_auth_flow.py`
  - `test_analyze_claim_metrics_speculative_text` in `tests/unit/test_metrics.py`
  - `test_analyze_claim_metrics_factual_text` in `tests/unit/test_metrics.py`
## [2026-09-23] feat: Complete Layer 0 baseline (bi-directional DOM scanner, local in-browser Web Worker AI, libp2p swarm sync & Vera brand unification)
- Branch: `feat/svelte5-byom-metrics`
- Scope:
  1. Bi-directional webpage DOM text extraction and WOT-style claim highlighting via `scannerService.js` and Chrome messaging (`GET_PAGE_CONTENT` & `HIGHLIGHT_PAGE_CLAIMS`).
  2. Local In-Browser AI Engine (`localAiService.js` / Web Worker) for zero-leakage, on-device claim analysis and classification.
  3. Foundational decentralized P2P transport (`p2pNode.js`) for claim attestation gossiping and swarm status tracking.
  4. Brand unification: harmonized all UI titles, manifests, headers, tooltips, and frame titles to Vera.
  5. Vitest test suite (`layer0.test.js`) verifying the Truth Table interactions.
- Files created:
  - `frontend/src/p2pNode.js`: Browser-compatible P2P node for claim broadcasting and peer swarm tracking.
  - `frontend/src/localAiService.js`: Client-side heuristic and on-device claim evaluation engine with zero cloud leakage.
  - `frontend/src/scannerService.js`: Bi-directional active tab scanning and DOM mark highlighting bridge.
  - `frontend/src/layer0.test.js`: Vitest test suite covering the 6 Truth Table interaction rows.
- Files modified:
  - `frontend/src/App.svelte`: Integrated `p2pNode`, local AI execution mode bypass, and active page scanning/highlighting.
  - `frontend/src/components/Header.svelte`: Updated brand to Vera and added P2P swarm connection badge.
  - `frontend/src/components/ByomModal.svelte`: Added 1-click option for Local In-Browser AI (WebGPU / Zero Data Leakage).
  - `extension/content.js`: Updated WOT tooltip badges and titles to Vera.
  - `extension/manifest.json`: Updated extension name, title, and description to Vera.
  - `extension/popup.html` & `frontend/static/frame.html`: Updated titles to Vera.
  - `frontend/static/dist/` & `extension/dist/`: Recompiled unified Svelte 5 production bundles.
- Tests added:
  - `test_extension_scan_page_success` in `frontend/src/layer0.test.js`
  - `test_web_scan_page_fallback` in `frontend/src/layer0.test.js`
  - `test_byom_local_worker_routing` in `frontend/src/layer0.test.js`
  - `test_p2p_claim_broadcast` in `frontend/src/layer0.test.js`
  - `test_p2p_claim_subscription` in `frontend/src/layer0.test.js`
  - `test_parser_4_categories` in `frontend/src/layer0.test.js`
## [2026-09-23] docs: Consolidate product documentation into docs/ and resolve conflicting legacy info
- Branch: `feat/svelte5-byom-metrics`
- Scope:
  1. Consolidate all product documentation under the canonical `docs/` folder (with `doc -> docs` symlink for flexible navigation).
  2. Create comprehensive `docs/features.md` unifying active Layer 0 features (Svelte 5 runes, local AI Web Worker, 4-verdict DOM highlighting, dual mini-charts, P2P swarm) and future Layers 1–3, removing obsolete "VeriFact AI" branding and legacy 3-metric ratings.
  3. Create updated `docs/user_journeys.md` covering all 5 end-to-end workflows (Local In-Browser fact checking, active tab scanning & WOT highlighting, frictionless 1-click uncap, P2P swarm gossip, Courtroom & truth settlement).
  4. Maintain a single definitive README.md at the project root linking directly to docs/PRD.md, docs/features.md, and docs/user_journeys.md (avoiding duplicate docs/README.md).
  5. Remove duplicate/conflicting root files features.md and user_journeys.md.
  6. Rebrand root README.md to Vera.
- Files created:
  - `docs/features.md`: Unified product features specification.
  - `docs/user_journeys.md`: Unified user journeys.
  - `doc`: Symbolic link pointing to `docs/`.
- Files modified:
  - `README.md`: Updated overview, Svelte 5 runes details, and documentation links.
  - `REPO_EDIT_LOG.md`: Documented consolidation.
- Files deleted:
  - `features.md` (root legacy file).
  - `user_journeys.md` (root legacy file).
  - `docs/README.md` (removed to preserve a single repository README).
- Verification:
  - Frontend Vitest: 9/9 tests passed (`npm run test`).
  - Backend Pytest: 19/19 tests passed (`uv run pytest tests/unit/`).
  - Documentation links and symlink verified.
## [2026-09-23] feat: Google Chrome Gemini Nano on-device LLM integration
- Branch: `feat/svelte5-byom-metrics`
- Scope:
  1. Integrate Google Chrome's Built-in AI Prompt API (`window.ai.languageModel` / `window.ai.assistant`) directly into Vera's local AI service (`localAiService.js`).
  2. Implement `getGeminiNanoAvailability()` detecting `'readily'` | `'after-download'` | `'no'` status.
  3. Implement `promptGeminiNano(text)` with strict JSON epistemic schema (`verdict`, `confidence`, `factsPct`, `opinionPct`, `falsehoodPct`, `explanation`).
  4. Implement smooth fallback hierarchy: Chrome Gemini Nano $\rightarrow$ client-side heuristic engine.
  5. Surface live Chrome Gemini Nano detection state in `ByomModal.svelte` with custom status badge and zero-leakage local connect preset.
  6. Add unit test `test_gemini_nano_integration_and_fallback` in `frontend/src/layer0.test.js` (10/10 Vitest tests passing).
- Files modified:
  - `frontend/src/localAiService.js`: Added Gemini Nano detection, prompting, and fallback.
  - `frontend/src/components/ByomModal.svelte`: Added Gemini Nano capability detection and UI indicator.
  - `frontend/src/layer0.test.js`: Added Row 7 Gemini Nano integration test.
  - `frontend/static/dist/` & `extension/dist/`: Recompiled production bundles.
- Verification:
  - Vitest: 10/10 passed (`npm run test`).
  - Pytest: 19/19 passed (`uv run pytest tests/unit/`).
  - Production build: `npm run build` compiled in 1.44s.
## [2026-09-23] feat: port Evidence Sources, Google Drive linking, and Fact Catalog into Svelte 5 cockpit
- Branch: `feat/svelte5-byom-metrics`
- Scope:
  1. Restore full feature parity with `main` by porting the Evidence & Grounding Sources drawer and the Fact Catalog & Database Metrics drawer into the modern Svelte 5 component architecture.
  2. Created `frontend/src/components/SourceEvidencePanel.svelte`:
     - Allows adding custom facts and evidence links.
     - Direct "Link Google Doc" and "Link Google Sheet" buttons connecting to Google Drive presets/references.
     - Toggle switch on each reference source to selectively include/exclude it from active grounding premise synchronization (`syncActivePremises`).
     - Share button to publish verified reference facts to the global community pool.
  3. Created `frontend/src/components/CatalogPanel.svelte`:
     - Allows submitting fact-check claims directly to the Firestore catalog with 4-category verdict and metrics (accuracy confidence, falsehood confidence, hallucination/opinion %).
     - "Fetch Database Catalog & Metrics Table" action to retrieve historical fact-checks.
  4. Updated `frontend/src/App.svelte`:
     - Added 2-column control center grid (`Evidence & Docs` and `Fact Catalog & Metrics`) below the Persistent MiniChart Dashboard.
     - Wired reactive runes state and premise synchronization handlers.
  5. Created `frontend/src/components/Panels.test.js`:
     - Unit tests for source filtering, Google Drive Doc/Sheet circular preset selection, and catalog payload formatting (15/15 Vitest tests passing).
- Files modified:
  - `frontend/src/components/SourceEvidencePanel.svelte` (NEW)
  - `frontend/src/components/CatalogPanel.svelte` (NEW)
  - `frontend/src/components/Panels.test.js` (NEW)
  - `frontend/src/App.svelte`: Integrated control center grid and panels.
## [2026-09-23] feat: remove svelte branding and restore permission modal, highlight claims button, and custom backend URL
- Branch: `feat/svelte5-byom-metrics`
- Scope:
  1. Removed all "Svelte" / "Svelte 5" branding from the user-facing application:
     - Removed `<span class="tag-svelte">Svelte 5</span>` and associated CSS from `frontend/src/components/Header.svelte`.
     - Updated HTML document title to "Vera - Decentralized AI Cockpit" in `frontend/static/frame.html`.
     - Renamed navigation button to "Cockpit" in `frontend/static/index.html`.
     - Changed agent query `user_id` from `svelte5-client` to `vera-client` in `frontend/src/App.svelte`.
  2. Restored Time-Bound Tab Permission Modal (`PermissionModal.svelte`):
     - Configurable duration cards: "Just once", "For 15 Minutes", "For 1 Hour", and "Always for this domain" (`∞`).
     - Animated SVG hourglass indicator with real-time countdown timer (`MM:SS` or `∞`) in the active tab bar.
     - Auto-prompt modal if user attempts to scan or highlight without granted permission.
  3. Restored Discrete "Highlight Claims" Action:
     - Dedicated button alongside "Scan Page" in the active tab bar.
     - Extracts sentence claim candidates from the active webpage, computes 4-category epistemic verdicts, and injects traffic-light highlights with Web-of-Trust (WOT) tooltips.
  4. Restored Custom Remote Backend URL Setting:
     - Configurable endpoint input in `ByomModal.svelte` with instant reset action.
     - Persisted to `localStorage` and `chrome.storage.local`.
     - Dynamically overrides default backend route in `getBackendEndpoint()`.
- Files modified:
  - `frontend/src/components/PermissionModal.svelte` (NEW)
  - `frontend/src/components/Header.svelte`: Removed Svelte 5 badge and styles.
  - `frontend/static/frame.html`: Updated page title.
  - `frontend/static/index.html`: Renamed navigation button to "Cockpit".
  - `frontend/src/components/ByomModal.svelte`: Added Custom Backend Endpoint URL input and storage handlers.
  - `frontend/src/App.svelte`: Wired `PermissionModal`, countdown timer loop, animated SVG hourglass, and discrete highlight button.
  - `frontend/src/components/Panels.test.js`: Added unit tests for time-bound expiration, custom URL resolution, and claim classification (18/18 tests passing).
  - `frontend/static/dist/` & `extension/dist/`: Recompiled production bundles.
- Verification:
  - Vitest: 18/18 passed (`npm run test`).
  - Pytest: 19/19 passed (`uv run pytest tests/unit/`).
  - Production build: `npm run build` compiled in 1.38s.
