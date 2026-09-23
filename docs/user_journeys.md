# Vera: User Journeys & End-to-End Workflows

This document maps the primary user workflows across the **Vera Ecosystem**, reflecting the active **Layer 0** capabilities and future **Layers 1–3** interactions.

---

## Journey 1: Local In-Browser Fact-Checking (Zero Cloud Leakage)

**Persona**: Privacy-conscious researcher verifying sensitive or embargoed statements.

1. **Access**: The user opens the Vera Web Cockpit (`frame.html`) or Extension Popup.
2. **Mode Selection**: The user opens the BYOM modal and clicks **"Run Local In-Browser AI (WebGPU / Zero Data Leakage)"**.
3. **Execution**: The user pastes a claim (e.g., *"Earth's core is cooling at approximately 100 degrees Celsius per billion years"*).
4. **On-Device Analysis**: Vera routes the text entirely to `localAiService.js` in a local Web Worker. No network requests are transmitted to `/chat` or external cloud APIs.
5. **Epistemic Breakdown**:
   - The persistent header dashboard and message card reflect: **85% Facts Grounded, 15% Speculation, 0% Falsehood**.
   - The claim is verified and assigned the `verified` badge.
6. **P2P Swarm Gossip**: A cryptographic hash of the verified claim is anonymously published to the local browser P2P swarm pool (`p2pNode.js`) with zero PII.

---

## Journey 2: Chrome Extension Active Webpage Scanning & WOT-Style Highlighting

**Persona**: Daily news reader browsing an investigative blog or social media article.

1. **Activation**: The user navigates to an online article and opens the Vera Chrome Extension popup.
2. **Scan Trigger**: The user clicks the **"Scan Page"** button in the active tab toolbar.
3. **DOM Extraction**: The extension communicates via `chrome.tabs.sendMessage` to `content.js`, requesting `GET_PAGE_CONTENT`. The visible body text and title are cleanly extracted.
4. **Agent Processing**: Vera's reasoning engine parses the article's core factual assertions and classifies each under the 4-category verdict taxonomy:
   - 🟢 `verified` (Grounded empirical facts)
   - 🟠 `disputed` (Conflicting authority sources)
   - 🔴 `misinformed` (Refuted claims or hallucinations)
   - 🟣 `need-additional-context` (Speculation or missing qualifiers)
5. **Bi-Directional Highlighting**: The agent sends `HIGHLIGHT_PAGE_CLAIMS` back to the tab. The host page DOM is updated with color-coded `<mark class="verifact-highlight">` spans.
6. **WOT Hover Interaction**: The user hovers over an amber-highlighted paragraph. A Web of Trust floating card appears displaying:
   - Category Badge: `🟠 DISPUTED CLAIM (88%)`
   - Explanatory verdict detailing the conflicting reports.
   - Cited grounding sources.

---

## Journey 3: Frictionless 1-Click Guest Agent & BYOM Upgrade

**Persona**: Non-technical user who has exceeded the 15-query daily free tier limit.

1. **Daily Cap Notification**: On query 16, Vera indicates the free tier daily limit has been reached (`0/15 Left`).
2. **Modal Invocation**: The user clicks the key icon or the upgrade prompt to open the Bring Your Own Agent modal.
3. **1-Click Frictionless Connect**: The user clicks **"Activate Guest Agent / Google AI One-Click Session"**.
4. **Zero-Credential Uncap**:
   - No external developer API keys or card entries are required.
   - The session token is persisted in `localStorage`.
   - The header updates to show `⚡ UNCAPPED` (`remaining: 999`).
5. **Alternative Providers**: Power users may alternatively enter direct API keys for Gemini, OpenAI GPT-4o, Claude 3.5 Sonnet, DeepSeek, or xAI Grok.

---

## Journey 4: Decentralized P2P Swarm Gossip & Community Truth Pool

**Persona**: Community fact-checker contributing verified claim attestations to a decentralized network.

1. **Verification**: A user checks a breaking public health assertion.
2. **Swarm Publication**: Upon verification, `p2pNode.js` computes a deterministic sha-256 digest of the claim tuple (`claimText`, `verdict`, `timestamp`).
3. **Peer Synchronization**: The record is gossiped to connected libp2p peers across WebRTC data channels.
4. **Collaborative Cache**: When another user on the swarm encounters the exact claim, Vera detects the matching hash in the local verified pool and returns instant, cached consensus without redundant compute or API costs.
5. **Swarm Health**: The top header displays live swarm connectivity (e.g., `⚡ P2P (2)`).

---

## Journey 5: Courtroom Deliberation & Truth Settlement (Layer 1 & 2 Preview)

**Persona**: Market participant or researcher challenging a viral disputed claim.

1. **Case Filing**: A user selects a disputed statement on ClearCloud or via the extension and clicks **"File Courtroom Case"**.
2. **DAG Decomposition**: Complex multi-part assertions (e.g., economic claims with multiple premises) are decomposed into a Directed Acyclic Graph of sub-claims.
3. **Validation Wagers**: Users stake collateral in a validation pool, calling or raising based on newly submitted primary documents.
4. **Resolution Pathways**:
   - *Supermajority Proof*: Definitive evidence submitted resolves the case, distributing wager pools to grounded validators.
   - *14-Day Stale Refund*: If no conclusive proof emerges after two weeks, 94% of wagers are refunded (6% platform fee).
   - *Case Reopening*: If biased voter turnout or new post-settlement evidence emerges, an escalated challenge wager reopens the case with dynamic quorum scaling.
5. **Reputation Feedback**: The user's hidden reputation score increases, conferring anonymous ZK-SNARK governance voting rights in the Epistemic DAO (Layer 3).
