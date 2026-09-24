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
| **Layer 0** | **Root DX Runner & Test Suite** | **Active** | `package.json`, Vitest, Pytest, Foundry | `npm test` runs 42 Vitest + 19 Pytest tests in `vera`. Root `npm run test:all` runs 225/225 tests across apps; combined with 39 Foundry tests in `DAO-Smart-Contract-Framework`, 264/264 tests pass ecosystem-wide. |
| **Layer 1.2** | **On-Device PII Scrubber & Claim Extractor** | **Active** | `frontend/src/scrubber/piiScrubberService.js` | Zero cloud leakage. Redacts PII, strips preambles, extracts falsifiable core claims. Exported via `@vera/core`. |
| **Layer 1.1** | **ClearCloud Relational Social Feed** | **Active** | `clearCloud/src/feed/` | 3-tier circles (Close Friends, Acquaintances, Network-Wide), Groundedness Index ranking, rage-bait scrubber. |
| **Layer 1.1** | **Hidden Asymmetric Reputation Engine** | **Active** | `clearCloud/src/feed/feedManager.js` | Rapid decay for ragebait (-18 to -25); slow accrual for grounded citations (+1.5 to +2.0). |
| **Layer 1.1** | **Epistemic Credit Score Interaction Weighting** | **Active** | `clearCloud/src/courtroom/reputationStakeGuard.js` | Quadratic down-weighting for low-rep likes/reactions ($\max(0.01, (\text{rep}/50)^2)$); juror vote credit scaling ($\max(0.05, \text{rep}/50)$). |
| **Layer 1.1** | **Stake-to-Repost & Stake-to-Post Guards** | **Active** | `clearCloud/src/courtroom/reputationStakeGuard.js` | Low-rep authors ($\text{rep} < 40$) must stake 10 USDC to post and 5 USDC to repost; verified citizens post/repost freely. |
| **Layer 1.1** | **Influencer Reach Bonds & Exponential Defense** | **Active** | `clearCloud/src/courtroom/reputationStakeGuard.js` | Influencers ($\ge 10\text{k}$ followers, $\text{rep} < 60$) must stake reach-scaled bonds; repeated disinfo escalates exponentially ($2^{\Delta/5} \times 2^{\text{strikes}}$) without ceiling. |
| **Layer 1.3** | **Courtroom Deliberation Forum & DAGs** | **Active** | `clearCloud/src/courtroom/caseManager.js` | Falsifiability Gatekeeper, Compound Claim DAG decomposition, juror voting, and AI Judge synthesis. |
| **Layer 1.3** | **Multi-Origin Case Initiation & Wagers** | **Active** | `clearCloud/src/courtroom/caseManager.js` | Cases initiated from `SOCIAL_MEDIA` (clearCloud) or `EXTENSION_APP` (Vera) with optional/mandatory validation wagers dispatched to `veracities.social`. |
| **Layer 1.3** | **Civic Sortition Engine (Sybil Gated)** | **Active** | `clearCloud/src/courtroom/sortitionEngine.js` | Summons 7–9 randomized citizens; gated by Proof of Humanity ($\ge 20$) or Staked Bonds ($\ge 10$ USDC). |
| **Layer 1.3** | **Blind Trial Engine & Decoy Dockets** | **Active** | `clearCloud/src/courtroom/blindTrialEngine.js` | Entity anonymization (`[Entity_A]`), deep semantic paraphrasing ($P(x,t)$), and synthetic decoy dockets. |
| **Layer 1.3** | **Substantive Evidence Gates & Clock Reset** | **Active** | `clearCloud/src/courtroom/caseManager.js` | Validates decentralized CIDs (`ipfs://`, `ar://`, `doi.org/`), relevance $\ge 0.70$, escalating deposits ($50 \times 2^{n-1}$). |
| **Protocol** | **ATProto & Web3 Identity Broker** | **Active** | `veracities.social/src/identity/` | BskyAgent `@atproto/api`, DID:PLC resolution, custom lexicons, and Web3 SIWE EIP-4361 (`siweLink.js`). |
| **Layer 2** | **Validation Market Prediction Pools** | **Active** | `veracities.social/src/market/validationMarket.js` | 4-outcome dynamic odds prediction pools (`VERIFIED`, `DISPUTED`, `MISINFORMED`, `NEED_CONTEXT`). |
| **Layer 2** | **Poker Evidence Rounds & Fold Action** | **Active** | `veracities.social/src/market/validationMarket.js` | 4-stage rounds (`Pre-Flop` $\to$ `Showdown`) with loss-mitigation `Fold` action. |
| **Layer 2** | **Truth Parleys & Derivative Hedges** | **Active** | `veracities.social/src/market/validationMarket.js` | Multi-claim parley tickets with compound multiplier; Epistemic Put & Call derivative hedge options. |
| **Layer 2** | **Losing Pool Slashing Waterfall** | **Active** | `veracities.social/src/market/validationMarket.js` | 15% Whistleblower Evidence Bounty, 5% Juror Deliberation Fee, 5% Protocol Fee. |
| **Layer 1.3 / Protocol** | **Courtroom Settlement Protocol** | **Active** | `veracities.social/src/settlement/` | 14-day cold case refund (94% refund / 6% fee), Challenge Bond retrials (50% bounty). |
| **Protocol / Oracles** | **Threshold Multi-Sig Oracle Relayer** | **Active** | `veracities.social/src/oracle/oracleRelayer.js` | Verifies $M$-of-$N$ EIP-712 citizen juror signatures and single-use nonces against sortition rosters. |
| **Layer 3** | **Epistemic DAO Governance ("EnDAOsment")** | **Active** | `veracities.social/src/governance/daoRegistry.js` | Multi-dimensional Epistemic Quotient ($EQ$) formula with two-stage consensus (Stage 1 Approval + Stage 2 Quadratic Voting with credit budgets) integrated with `DAO-Smart-Contract-Framework` (`EpistemicCrsManager.sol`). |
| **Layer 3** | **Semaphore ZK Anonymous Voting** | **Active** | `veracities.social/src/governance/zkSemaphoreBridge.js` | Client-side Semaphore ZK identity bridge with single-use nullifiers in `GovernanceView.svelte`. |
| **Layer 2 / 3** | **UUPS Upgradeable Smart Contracts & Proxies** | **Active** | `veracities.social/contracts/` | `ValidationMarket.sol`, `CourtroomEscrow.sol`, `EpistemicGovernor.sol` behind `ERC1967Proxy.sol` with modular DAO framework adapters (OpenZeppelin, Gnosis Safe Zodiac, Aragon OSx, EnDAOsment Framework). |

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

