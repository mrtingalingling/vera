# Vera — Features Reference & Implementation Matrix

> [!NOTE]
> **Source of Truth**: [`docs/PRD.md`](./PRD.md) is the authoritative specification for all architecture, layer dynamics, game-theoretic mechanisms, and multi-layer roadmaps. This document serves as a developer and operational reference mapping features to code files, configuration parameters, and execution state.

---

## 1. Ecosystem Feature Matrix

| Layer | Feature / Capability | Status | Primary Code Files / Entrypoints | Configuration & Notes |
|---|---|---|---|---|
| **Layer 0** | **Svelte 5 Runes Cockpit** | **Active** | `frontend/src/App.svelte`, `Header.svelte` | Zero-VDOM signal reactivity (`$state`, `$derived`, `$effect`). Mounts on `#svelte-frame-root`. |
| **Layer 0** | **Dual-Target Unified Build** | **Active** | `package.json`, `frontend/vite.config.js` | Single command (`npm run build`) outputs to both `frontend/static/dist/` and `extension/dist/`. |
| **Layer 0** | **Local In-Browser AI (Web Worker)** | **Active** | `frontend/src/localAiService.js` | Zero cloud leakage. On-device heuristics and WebGPU worker offload. |
| **Layer 0** | **Chrome Built-In AI (Gemini Nano)** | **Active** | `frontend/src/components/ByomModal.svelte` | Direct browser integration via `window.ai` / `ai.languageModel`. |
| **Layer 0** | **Frictionless 1-Click Guest Agent** | **Active** | `ByomModal.svelte`, `frontend/main.py` | 1-click in-app Google AI session; bypasses free-tier limit (`remaining: 999`). |
| **Layer 0** | **BYOM Multi-Model & Custom Keys** | **Active** | `ByomModal.svelte`, `frontend/main.py` | Supports Gemini, OpenAI, Claude, DeepSeek, Grok, and custom endpoints. |
| **Layer 0** | **Custom Remote Backend Presets** | **Active** | `ByomModal.svelte`, `localStorage` | Quick presets: Local (`:8080`), Ollama (`:11434`), Cloud Run Gateway. |
| **Layer 0** | **Time-Bound Tab Permissions** | **Active** | `PermissionModal.svelte`, `background.js` | Granular duration: *Once*, *15m*, *1h*, *Always*. Persisted in `chrome.storage.local`. |
| **Layer 0** | **Animated SVG Hourglass Indicator** | **Active** | `App.svelte` | Live countdown in tab header (`Active: MM:SS` or `Active: ∞`). |
| **Layer 0** | **Discrete Scan Page Action** | **Active** | `App.svelte`, `content.js` | Full conversational multi-turn analysis inside Cockpit chat stream. |
| **Layer 0** | **Discrete In-Page Highlight Action** | **Active** | `App.svelte`, `content.js`, `manifest.json` | Visual DOM annotation (`<mark>`) without chat clutter. Keybinding: `Alt+Shift+H`. |
| **Layer 0** | **4-Category Verdict Classification** | **Active** | `frontend/extension_parser.py`, `content.js` | 🟢 `verified`, 🟠 `disputed`, 🔴 `misinformed`, 🟣 `need-additional-context`. |
| **Layer 0** | **Web-of-Trust (WOT) Hover Cards** | **Active** | `extension/content.js` | Interactive floating tooltips showing category, confidence score, and sources. |
| **Layer 0** | **Facts vs. Opinion Mini-Chart** | **Active** | `frontend/metrics.py`, `MiniChart.svelte` | Persistent header summary + embedded per-message breakdown cards. |
| **Layer 0** | **Evidence & Premise Grounding Drawer** | **Active** | `SourceEvidencePanel.svelte`, `App.svelte` | Custom premise input, dynamic enable/disable toggling (`syncActivePremises`). |
| **Layer 0** | **Google Drive Grounding Presets** | **Active** | `SourceEvidencePanel.svelte`, `App.svelte` | 1-click Google Docs and Google Sheets reference presets. |
| **Layer 0** | **Fact Catalog & Database Drawer** | **Active** | `CatalogPanel.svelte`, `App.svelte` | Direct Firestore truth logging with accuracy, falsehood, and hallucination scores. |
| **Layer 0** | **libp2p Decentralized P2P Swarm** | **Active** | `frontend/src/p2pNode.js` | Browser-to-browser claim hash gossip; header swarm status indicator. |
| **Layer 0** | **Tactile Feedback Toast System** | **Active** | `App.svelte` (`toastMessage`, `showToast`) | Floating glassmorphism alerts for premise changes, doc links, and saves. |
| **Layer 0** | **Drawer Accordion Auto-Collapse** | **Active** | `App.svelte` | Mutually exclusive drawers; auto-collapse when modals open to save screen space. |
| **Layer 0** | **Root DX Runner & Test Suite** | **Active** | `package.json`, Vitest, Pytest | `npm test` runs 20 Vitest + 19 Pytest tests concurrently in under 4s. |
| **Layer 1** | **ClearCloud Relational Social Feed** | Planned | *Spec: [PRD § 4.1](./PRD.md#41-clearcloud-the-epistemic-social-network)* | Groundedness-ranked feed across 3 concentric relational tabs. |
| **Layer 1** | **Hidden Asymmetric Reputation Engine** | Planned | *Spec: [PRD § 4.1.3](./PRD.md#413-the-hidden-reputation-engine-mechanics)* | Rapid decay for ragebait; slow accrual for grounded citations. Dictates post reach. |
| **Layer 1** | **WebGPU Local PII Scrubber** | Planned | *Spec: [PRD § 4.2](./PRD.md#42-private-messaging-add-on-whatsapp-wechat-telegram)* | Sanitizes names, emails, and phone numbers locally on-device before processing. |
| **Layer 1** | **The Courtroom Deliberation Forum** | Planned | *Spec: [PRD § 4.3](./PRD.md#43-the-courtroom-falsifiable-deliberation-forum)* | Structured debate, DAG claim decomposition, and 14-day settlement windows. |
| **Layer 2** | **Poker-Style Claim Wagering** | Planned | *Spec: [PRD § 5.1](./PRD.md#51-poker-style-claim-wagering-mechanics)* | Call, raise, and fold positions as evidence is submitted during deliberation. |
| **Layer 2** | **Parleys & Derivative Hedges** | Planned | *Spec: [PRD § 5.2](./PRD.md#52-parleys-and-derivative-hedges)* | Multi-claim verification bundles and cross-claim hedge contracts. |
| **Layer 2** | **Dual Settlement Oracles** | Planned | *Spec: [PRD § 5.3](./PRD.md#53-dual-settlement-oracles)* | Automated deterministic resolvers + Courtroom Jury Oracles. |
| **Layer 3** | **Anonymous ZK-SNARK Reputation Bridge** | Planned | *Spec: [PRD § 6.1](./PRD.md#61-zk-snark-reputation-bridge)* | Proves high epistemic standing anonymously without doxxing identity. |
| **Layer 3** | **Empathy & Bridging Voting Weights** | Planned | *Spec: [PRD § 6.2](./PRD.md#62-empathy--bridging-voting-weights)* | Grants bonus DAO voting weight to users who steel-man opponents or bridge divides. |
| **Layer 3** | **Decentralized Protocol Governance** | Planned | *Spec: [PRD § 6.3](./PRD.md#63-ecosystem-stewardship--dao-treasury)* | Community control over fee distributions, oracle thresholds, and upgrades. |

---

## 2. Active Layer 0 Reference Guide

For detailed technical requirements, see [PRD Section 3](./PRD.md#3-layer-0-vera-core-agent-current-active-baseline). Key implementation details:

### 2.1 Epistemic Verdict Taxonomy
Used by `frontend/extension_parser.py` and `extension/content.js`:
- **`verified`**: Empirical grounding $\ge 80\%$. Class: `.verifact-verdict-verified` (Neon Green).
- **`disputed`**: Conflicting reliable evidence. Class: `.verifact-verdict-disputed` (Amber/Orange).
- **`misinformed`**: Definitively refuted / debunked. Class: `.verifact-verdict-misinformed` (Crimson Red).
- **`need-additional-context`**: Speculation, subjective projection, or missing context. Class: `.verifact-verdict-context` (Purple).

### 2.2 Time-Bound Permission Model
Stored in `chrome.storage.local` under `tab_permission`:
- Schema: `{ granted: boolean, duration: "once" | "15m" | "1h" | "always", grantedAt: number, expiresAt: number | null }`.
- Verified in `background.js` prior to processing page scan or `Alt+Shift+H` shortcut commands.

### 2.3 Remote Backend Endpoint Resolution
Resolved in `App.svelte` and `popup.js`:
1. Check `localStorage.getItem("backendUrl")` or `chrome.storage.local.get(["backendUrl"])`.
2. If non-empty, route requests to the specified URL.
3. Fallback: `/chat` (when served over HTTP) or `http://localhost:8080/chat`.

---

## 3. Future Expansion Layers (1–3) Reference

All requirements, mathematical formulations, game theory rules, and lifecycle dynamics for Layers 1–3 are maintained exclusively in the master PRD:
- **Layer 1 (Social Suite)**: See [PRD Section 4: The Social Suite](./PRD.md#4-layer-1-the-social-suite-epistemic-social-network).
- **Layer 2 (Validation Markets)**: See [PRD Section 5: Truth Settlement & Validation Markets](./PRD.md#5-layer-2-truth-settlement--validation-markets).
- **Layer 3 (Epistemic DAO)**: See [PRD Section 6: Epistemic DAO & Decentralized Governance](./PRD.md#6-layer-3-epistemic-dao--decentralized-governance).
- **Cross-Layer Interconnection Matrix**: See [PRD Section 7: Cross-Layer Interconnection Matrix](./PRD.md#7-cross-layer-interconnection-matrix).

