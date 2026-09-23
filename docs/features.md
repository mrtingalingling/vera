# Vera — Comprehensive Features Specification

This document details the complete feature set of the **Vera Ecosystem**, organized by layer. It unifies all operational capabilities in the active baseline (**Layer 0**) with the planned concurrent expansions (**Layers 1, 2, and 3**), resolving legacy naming and metrics discrepancies.

---

## 1. Architectural Overview & Layer Model

```
       ┌────────────────────────────────────────────────────────┐
       │                Layer 1: Social Suite                   │
       │  • ClearCloud: Relational Feed & Hidden Reputation     │
       │  • Chat Add-on: WebGPU Local PII Scrubber              │
       │  • The Courtroom: Falsifiable Deliberation & DAGs      │
       └──────────────┬──────────────────────────┬──────────────┘
                      │                          │
       Direct Quality │                          │ Spawns Claim
       & EQ Signals   │                          │ Markets & Jury
                      ▼                          ▼
┌─────────────────────────────┐   ┌─────────────────────────────┐
│   Layer 3: Epistemic DAO    │   │ Layer 2: Validation Market  │
│  (Governance & Ecosystem    │   │  (Monetizing Fact Discovery │
│         Improvement)        │   │     & Truth Settlement)     │
│ • Anonymous ZK-SNARK Bridge │   │ • Poker-Style Wagering      │
│ • Empathy / Bridging Votes  │   │ • Parleys & Derivatives     │
│ • Proposal & Upgrade Power  │   │ • On-Chain + Jury Oracles   │
└─────────────────────────────┘   └─────────────────────────────┘
                      ▲                          ▲
                      └──────────────┬───────────┘
                                     │ Grounded Metrics &
                                     │ Verification Hooks
┌────────────────────────────────────┴──────────────────────────────────────────┐
│                      Layer 0: Vera Core Agent (ACTIVE)                        │
│  • Svelte 5 Runes Unified Frame (Web Cockpit & Chrome Extension Popup)        │
│  • Hybrid In-Browser (WebGPU) + BYOM Cloud Agents (1-Click & Custom Keys)     │
│  • Real-Time 4-Category Verdict DOM Highlighting                              │
│  • Persistent & Embedded Fact vs. Opinion/Speculation Mini-Charts             │
│  • libp2p Decentralized P2P Transport Layer                                   │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Layer 0: Vera Core Agent (Active Baseline)

### 2.1 Unified Svelte 5 Runtime & Dual-Target Build
- **Signal-Driven Ergonomics**: Implemented using Svelte 5 Runes (`$state`, `$derived`, `$effect`) for zero-VDOM fine-grained text rendering.
- **Unified Build Output**: A single Vite build command (`npm run build`) in `frontend/vite.config.js` synchronizes production bundles directly to both:
  - `frontend/static/dist/` (for standalone web application)
  - `extension/dist/` (for Chrome Manifest V3 extension popup)
- **Zero Drift Mounting**: `frontend/static/frame.html` and `extension/popup.html` share the exact same `#svelte-frame-root` mount target and bundle assets.

### 2.2 Dual-Execution AI Architecture (Local + Cloud)
- **Local In-Browser Engine (`frontend/src/localAiService.js`)**:
  - **Zero Data Leakage**: Evaluates claims on-device using client-side heuristics and WebGPU/Web Worker offload.
  - **Speculation & Falsehood Detection**: Detects opinion markers (*"think"*, *"feel"*, *"forecast"*) vs. established empirical facts without transmitting private queries over the internet.
- **Cloud Reasoning Engine & BYOM Proxy (`frontend/main.py`)**:
  - Proxies requests to Google Cloud Reasoning Engines or user-selected third-party providers.
  - Enforces a 15-query/day rate limit on free tier, automatically lifted when BYOM or Guest mode is active.

### 2.3 Bring Your Own Model (BYOM) & Frictionless Authentication
- **1-Click Guest Agent Preset**: One-click activation sets an in-app Google AI agent session with zero credentials required, permanently unlocking uncapped fact-checking (`remaining: 999`).
- **1-Click Local In-Browser AI**: Switches the client to pure on-device zero-leakage mode.
- **Chrome Built-In AI (Gemini Nano)**: Directly queries browser on-device LLM capabilities (`window.ai` / `ai.languageModel`) when available.
- **Google Account OAuth**: Default authenticated path using Chrome Identity or Google OAuth tokens.
- **Multi-Provider API Integration**: Supports direct API key entry for:
  - Google Gemini (Gemini 2.5 Flash / Pro)
  - OpenAI (GPT-4o / GPT-4o-mini)
  - Anthropic (Claude 3.5 Sonnet / Opus)
  - DeepSeek (DeepSeek V3 / R1)
  - xAI Grok (Grok-2)
  - OpenRouter / Custom endpoints
- **Custom Remote Backend Endpoint URL**:
  - Allows users to route extension queries to a custom Cloud Run, private Agent Gateway, or local Ollama proxy instead of `http://localhost:8080/chat`.
  - Persisted in `localStorage` and `chrome.storage.local` with an instant one-click reset action.

### 2.4 Time-Bound Tab Permissions & In-Page DOM Verification
- **Time-Bound Tab Access Modal (`frontend/src/components/PermissionModal.svelte`)**:
  - Enforces explicit user consent before extracting DOM content.
  - Granular duration options:
    - *Just once*: One-shot scanning / highlighting access.
    - *For 15 Minutes*: Short reading session.
    - *For 1 Hour*: Extended research session.
    - *Always for this domain* (`∞`): Continuous authorization.
- **Animated SVG Hourglass Live Countdown Indicator**:
  - An animated rotating SVG hourglass lives in the active tab toolbar.
  - Displays remaining authorization time (`Active: MM:SS` or `Active: ∞`).
  - Clicking the banner opens the modal to extend duration or immediately revoke access.
- **Discrete User Actions**:
  - **"Scan Page"**: Extracts active tab content and conducts conversational multi-turn analysis inside the Cockpit chat stream.
  - **"Highlight Claims"**: In-page visual annotation that directly injects traffic-light highlights on the webpage DOM without cluttering the chat.
- **4-Category Verdict Classification (`extension/content.js`)**:
  - Highlights claims directly within the webpage DOM:
    1. 🟢 **Verified Fact** (`verifact-verdict-verified`): Grounded in established empirical baselines.
    2. 🟠 **Disputed Claim** (`verifact-verdict-disputed`): Conflicting evidence across reliable authorities.
    3. 🔴 **Misinformed / False** (`verifact-verdict-misinformed`): Definitively refuted claims or hallucinations.
    4. 🟣 **Needs Additional Context** (`verifact-verdict-context`): Subjective projection or missing qualifiers.
- **Web of Trust (WOT) Hover Cards**:
  - Floating interactive tooltips attached to each highlighted text span reveal confidence scores, cited sources, and explanatory reasoning.

### 2.5 Epistemic Metrics & Dual Mini-Chart Visualization
- **Fact vs. Opinion/Speculation Breakdown (`frontend/metrics.py`)**:
  - Calculates real-time ratios: `factsPct`, `opinionPct`, `falsehoodPct`.
- **Persistent Header Dashboard**:
  - Top bar maintains cumulative session and page-level factual health.
- **Embedded Response Cards**:
  - Every individual chat message displays a claim-specific breakdown gauge.

### 2.6 Decentralized P2P Transport Baseline
- **libp2p Swarm Node (`frontend/src/p2pNode.js`)**:
  - Deterministic claim hashing (`0x...` digest).
  - P2P claim broadcasting (`publishClaim`) and subscription (`subscribeClaims`).
  - Swarm connection status indicator (`⚡ P2P (2)`) in the frame header.

### 2.7 Evidence Sources & Grounding Premise Drawer (`frontend/src/components/SourceEvidencePanel.svelte`)
- **Custom Evidence & Reference Links**: Users can input reference statements and research URLs.
- **Google Drive Integration**: One-click linking to **Google Docs** and **Google Sheets** telemetry/guideline presets.
- **Dynamic Premise Synchronization (`syncActivePremises`)**: Toggle switches enable users to selectively include or exclude specific sources from the active agent grounding prompt.
- **Community Pool Sharing**: Users can publish verified reference facts to the shared community truth pool.

### 2.8 Fact Catalog & Database Metrics Drawer (`frontend/src/components/CatalogPanel.svelte`)
- **Direct Catalog Logging**: Submit verified fact-checks directly to the Firestore truth catalog with 4-category verdicts and granular confidence metrics (accuracy %, falsehood %, speculation %).
- **Database Querying**: "Fetch Database Catalog & Metrics Table" action retrieves historical fact-checks for transparency.

### 2.9 Google Cloud Backend Grounding
- **Vertex AI Reasoning Engine (`app/agent.py`)**: Gemini-powered conversational agent with tool orchestration.
- **Code Executor Python Sandbox**: Executes statistical heuristic calculations for confidence weighting.
- **Vertex AI RAG Engine**: Indexes verified truth documents and guidelines for grounded answers.
- **Cloud Firestore**: Persistent storage for community-shared fact records.

---

## 3. Layer 1: Social Suite (Future Concurrent Expansion)

### 3.1 ClearCloud (Epistemic Social Media)
- **Groundedness-Ranked Feed**: Replaces engagement/rage algorithms with ranking based on Verifiable Facts vs. Unbacked Assertions ratio.
- **Concentric 3-Circle Relational Tabs**:
  1. *Close Friends*: High-intimacy updates with zero algorithmic manipulation.
  2. *Friends & Acquaintances*: Extended personal network.
  3. *Network-Wide*: Global feed strictly gated by content Groundedness Score.
- **Hidden Asymmetric Reputation Engine**:
  - Severe penalty for rage-bait, deceptive framing, and debunked misinformation.
  - Slow, steady accrual for rigor, citations, and validated claims.
  - Hidden score dynamically throttles or expands post distribution.

### 3.2 Private Messaging Add-On (WhatsApp, WeChat, Telegram)
- **WebGPU Local PII Scrubber**: Sensitive names, phone numbers, and addresses are scrubbed locally in the browser before optional cloud verification.
- **In-Chat Fact Grounding**: Inline subtle indicators on forwarded links and viral claims.

### 3.3 The Courtroom (Falsifiable Deliberation Forum)
- **Structured Case Creation**: Users highlight disputed text to spawn a formal debate case.
- **DAG Case Decomposition**: Complex claims break down into sub-claims (Directed Acyclic Graph) where prerequisites must resolve first.
- **Resolution Outcomes**:
  1. *Conclusive Proof*: Supermajority consensus within 14 days.
  2. *Stale / Cold*: No conclusive proof after 14 days $\rightarrow$ 94% wager refunded (6% platform fee).
  3. *Case Reopening*: New evidence or low turnout allows escalating challenge wagers with dynamic quorum scaling.

---

## 4. Layer 2: Truth Settlement & Validation Markets

- **Poker-Style Claim Wagering**: Call, raise, or fold as evidence unfolds during deliberation.
- **Parleys & Derivative Hedges**: Bundle multiple verifiable predictions into parley contracts.
- **Dual Settlement Oracles**: Algorithmic resolution for deterministic data, Courtroom Jury Oracles for nuanced verification.

---

## 5. Layer 3: Epistemic DAO (Governance & Ecosystem Improvement)

- **ZK-SNARK Reputation Bridge**: Anonymously proves high epistemic standing without revealing personal identity.
- **Empathy & Bridging Voting Weights**: Extra voting power allocated to users who successfully steel-man opponents or bridge polarized discussions.
- **Ecosystem Stewardship**: Directs platform development, fee distribution, and truth settlement parameters.
