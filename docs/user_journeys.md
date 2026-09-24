# Vera: User Journeys & End-to-End Workflows

> [!NOTE]
> **Source of Truth**: [`docs/PRD.md`](./PRD.md) is the authoritative architectural and requirements specification. For the implementation matrix and file entrypoints, see [`docs/features.md`](./features.md). This document maps human interaction narratives and end-to-end user workflows.

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

## Journey 5: Courtroom Deliberation & Truth Settlement (clearCloud & veracities.social)

**Persona**: Market participant or researcher challenging a viral disputed claim.

1. **Case Filing**: A user selects a disputed statement in **clearCloud** or via the Vera extension and clicks **"Docket Case to Courtroom"**.
2. **Falsifiability Check & DAG Decomposition**: The Falsifiability Gatekeeper admits testable empirical propositions. Multi-part assertions are decomposed into a Directed Acyclic Graph (DAG) of sub-claims.
3. **Validation Wagers**: Collateral is staked into **veracities.social**'s Validation Market prediction pool.
4. **Resolution Pathways**:
   - *Supermajority Proof*: Definitive evidence submitted resolves the case (66.7% jury consensus threshold), distributing wager pools via `courtroomSettlement.js`.
   - *14-Day Stale Refund*: If no conclusive proof emerges after two weeks, **94% of wagers are refunded** (6% protocol maintenance fee retained).
   - *Challenge Bond Appeals*: If new verifiable evidence emerges, an escalated challenge bond reopens the case. Overturning awards the challenger their bond + 50% bounty.
5. **Reputation Feedback**: The user's hidden reputation score updates in **clearCloud** (`+1.5` to `+2.0` on affirmation; `-18.0` on debunking; `-25.0` on slashing), impacting post distribution in the feed.

---

## Journey 6: Time-Bound Tab Permission & In-Page Visual Annotation

**Persona**: Privacy-conscious browser reading an online news article.

1. **Permission Request**: The user opens the Vera extension. In the active tab bar, the "Tab Access" pill alerts the user that reading access is currently not granted.
2. **Duration Selection**: The user clicks the button. The **Time-Bound Permission Modal** appears with options: *Just once*, *For 15 Minutes*, *For 1 Hour*, or *Always for this domain*.
3. **Granting Access**: The user selects **For 15 Minutes**. The modal closes, and the active tab bar displays an animated rotating SVG hourglass with a live countdown: `Active: 14:59`.
4. **Highlighting Claims**: The user clicks the discrete **"Highlight"** button in the tab bar.
5. **DOM Highlighting**: Vera extracts page sentences, categorizes claims into 4 epistemic categories, and injects `<mark>` tags into the webpage DOM.
6. **WOT Hover**: The user reads the article; hovering over colored claim spans reveals Web-of-Trust cards with confidence scores, cited sources, and epistemic reasoning.
7. **Expiration**: After 15 minutes, the timer reaches zero, permission expires, and the banner resets to protect user privacy.

---

## Journey 7: Grounding with Personal Google Drive Docs & Custom Knowledge Pool

**Persona**: Enterprise researcher or policy analyst fact-checking against proprietary internal data.

1. **Opening Evidence Drawer**: The user clicks **"Evidence & Docs"** in the Control Center grid.
2. **Linking Google Docs**: The user clicks **"Link Google Doc"** (or **"Link Google Sheet"**), connecting an internal reference document into the active grounding pool.
3. **Adding Custom Facts**: The user enters custom empirical statements and research URLs directly into the drawer.
4. **Selective Grounding**: The user toggles specific premises on or off. Vera calls `syncActivePremises`, injecting the active subset into the agent's prompt context.
5. **Grounded Query**: The user asks a question in the chat. The agent validates against both public truth and the user's active custom Google Docs / Sheets references.
6. **Community Sharing**: The user clicks **"Share Fact"** to anonymously publish the verified reference to the decentralized community pool.

---

## Journey 8: Cataloging Verified Claims & Epistemic History Querying

**Persona**: Data journalist archiving fact-check investigations into a persistent store.

1. **Opening Fact Catalog Drawer**: The user clicks **"Fact Catalog & Metrics"** in the Control Center grid.
2. **Logging a Claim**: The user enters a verified claim statement, selects a verdict (`Verified Fact`, `Disputed Claim`, `Misinformed / False`, or `Needs Additional Context`), and configures confidence sliders (e.g., 90% accuracy, 5% falsehood, 5% speculation).
3. **Saving to Database**: Clicking **"Save Fact-Check to Catalog"** writes the record directly to Firestore.
4. **Fetching Historical Truth Records**: The user clicks **"Fetch Database Catalog & Metrics Table"** to retrieve and review recent community fact-checks, verification hashes, and aggregate truth metrics.

---

## Journey 9: Private Messaging On-Device PII Scrubbing & Claim Ingestion (Feature 1.2)

**Persona**: Privacy-conscious user receiving a sensationalist forwarded chain message in WhatsApp Web or Telegram Web.

1. **Message Selection**: The user highlights a forwarded message:
   > *"Listen everyone, my doctor friend at Mayo Clinic says atmospheric CO2 reached 420 ppm in 2024. Contact bob@lab.org or call 555-123-4567 before they delete this!"*
2. **On-Device Ingestion**: Vera triggers `piiScrubberService.createVerificationPreview(text)` directly inside the local browser sandbox.
3. **Automated Redaction & Extraction**:
   - PII is redacted: `bob@lab.org` $\rightarrow$ `[REDACTED_EMAIL]`, `555-123-4567` $\rightarrow$ `[REDACTED_PHONE]`.
   - Authority fluff and forward chatter are cleanly stripped.
   - Core claim extracted: `"Atmospheric CO2 reached 420 ppm in 2024"`.
4. **Zero-Leakage Preview Gate**: Vera presents an in-app verification preview displaying the sanitized text and extracted core claim with the notice:
   > *"Zero private or personal information will leave your machine."*
5. **Approved Execution**: Once confirmed by the user, the clean claim is validated locally via on-device Gemini Nano / local heuristics, or seamlessly posted to **clearCloud** for community deliberation.

---

## Journey 10: Civic Jury Sortition & Blind Deliberation (clearCloud)

**Persona**: Registered citizen selected for civic duty on a contentious political or scientific claim.

1. **Summons Notification**: The user receives a civic summons notification in **clearCloud** generated by `sortitionEngine.js`.
2. **Sybil Verification**: The protocol verifies the user's Proof of Humanity score ($\ge 20$) or Staked Civic Bond ($\ge 10$ USDC) and confirms zero conflict of interest (no active market wagers).
3. **Entering the Blind Courtroom**: The juror enters the case docket. The `blindTrialEngine.js` renders the claim with:
   - Partisan entities anonymized to `[Entity_A]` and `[Entity_B]`.
   - Emotional rhetoric and inflammatory adjectives stripped.
   - Deep semantic paraphrasing ($P(x,t)$) applied to suppress stylometric identification.
4. **Evaluating Substantive Evidence**: The juror inspects decentralized CID links (`ipfs://`, `ar://`, `doi.org/`) and AI judge relevance scores.
5. **Casting the Secret Ballot**: The juror casts their verdict (`VERIFIED`, `DISPUTED`, `MISINFORMED`, `NEED_CONTEXT`). When supermajority consensus ($\ge 66.7\%$) is reached, an $M$-of-$N$ EIP-712 threshold attestation is signed and relayed.
6. **Deliberation Rewards**: The juror receives their share of the 5% Juror Deliberation Fee from the losing market pool in `veracities.social`.

---

## Journey 11: Validation Market Wagering, Poker Rounds & Parley Hedging (veracities.social)

**Persona**: Prediction market trader staking conviction on breaking investigative reporting.

1. **Exploring Markets**: The trader navigates to the **MARKETS** tab in `veracities.social` (`MarketView.svelte`).
2. **Pre-Flop Staking**: The trader stakes 200 USDC on `VERIFIED` during the initial `Pre-Flop` round before major evidence is unsealed.
3. **Evidence Drop & Loss Mitigation**: In Stage 2 (`Evidence Drop`), contradictory evidence is unsealed. The trader uses the **Fold Action Bar** to fold their position, salvaging 50% of their stake before `Showdown`.
4. **Truth Parley Multiplier**: The trader opens the **Parley Ticket Builder**, selecting 3 independent correlated scientific claims. The system calculates the compound multiplier ($2.4\times \times 1.8\times \times 3.1\times = 13.39\times$).
5. **Epistemic Derivative Hedge**: To protect a large `VERIFIED` position against unexpected retrial appeals, the trader purchases an **Epistemic Put Option** at strike 0.70 with a 14-day expiry.
6. **Settlement**: At `Showdown`, the oracle relayer verifies the citizen jury attestation, executes the slashing waterfall (15% whistleblower, 5% juror, 5% protocol), and credits the trader's balance.

---

## Journey 12: Epistemic DAO Governance & Semaphore ZK Ballots (veracities.social)

**Persona**: High-reputation researcher participating in protocol governance without revealing their real-world identity.

1. **Viewing Epistemic Passport**: The user opens the **Epistemic DAO & ZK Ballots** tab in `veracities.social` (`GovernanceView.svelte`).
2. **Tier & Weight Inspection**: The system calculates the user's Epistemic Quotient ($EQ = 88.4$) and displays their **Sage Elder** status with a $30\times$ quadratic voting multiplier.
3. **Selecting a Proposal**: The user reviews an active proposal (e.g., *"Allocate 30% of Protocol Fees to Scientific Deliberation Subsidy Pool"*).
4. **Generating Zero-Knowledge Proof**: The client-side `zkSemaphoreBridge.js` generates a Semaphore ZK proof:
   - Proves membership in the Epistemic Governor Merkle tree.
   - Computes a deterministic single-use `nullifierHash` tied to the proposal scope.
   - Keeps the user's DID and private key completely undisclosed.
5. **Submitting Anonymous Ballot**: The contract `EpistemicGovernor.sol` verifies the ZK proof, checks that the nullifier has never been used, and tallies the vote with the user's tier weight.
6. **Cryptographic Receipt**: The user receives a cryptographic receipt containing their single-use nullifier hash as non-repudiation proof.

---

## Journey 13: Epistemic Credit Score & Exponential Disinformation Defense (clearCloud)

**Persona**: Social platform user encountering interaction weighting, staking requirements, and systemic deterrence against disinformation.

1. **Quadratic Like Damping**: A coordinated bot ring attempts to boost an unsubstantiated conspiracy theory. Because each bot account has an epistemic credit score of $\text{rep} = 5.0$, their likes are down-weighted quadratically by $99\%$ ($\text{weight} = 0.01\times$), neutralizing artificial amplification.
2. **Stake-to-Repost**: A low-reputation user ($\text{rep} = 32.0$) attempts to repost a contested claim. The interface notifies them that their reputation is below the threshold ($40.0$), requiring an escrow stake bond of $5.0$ USDC (`REQUIRED_REPOST_STAKE_USDC`). Once deposited, the repost is labeled `REPOSTED_STAKED_PROVISIONAL`.
3. **Influencer Reach Staking**: A prominent account with $50,000$ followers whose reputation has slipped to $52.0$ attempts to broadcast a new claim. Because their reach exceeds $10,000$ followers and their score is below $60.0$, the system calculates an audience-scaled stake bond ($1.0 + \log_{10}(5) = 1.70\times$ base) requiring an escrow deposit before publishing.
4. **Exponential Disinformation Penalty**: A malicious creator with 3 previous disinformation strikes and a reputation crashed to $20.0$ attempts to post another claim. The unbounded exponential penalty curve triggers:
   $$\text{Stake} = 10.0 \times 2^{\frac{40 - 20}{5}} \times 2^3 = 10 \times 16 \times 8 = 1,280.0 \text{ USDC}$$
   With no upper ceiling, continuing to spread disinformation becomes financially impossible to sustain.

---

## Journey 14: Multi-Origin Case Initiation & Validation Wagers (clearCloud & Vera Extension)

**Persona**: Investigative journalist initiating a formal courtroom case on a breaking corporate claim.

1. **Origin Selection**: The user identifies a claim either on the clearCloud social feed (`SOCIAL_MEDIA`) or by highlighting text via the Vera browser extension (`EXTENSION_APP`).
2. **Case Submission**: The user clicks **"Initiate Case Docket"**.
3. **Falsifiability Check**: The AI Gatekeeper verifies that the claim is empirical and falsifiable.
4. **Validation Wager Escrow**: When `CASE_WAGER_REQUIRED` is active, the creator deposits the initial validation wager ($25.0$ USDC minimum). Low-reputation initiators pay a risk-adjusted surcharge based on credit score.
5. **Cross-Chain Dispatch**: The case manager opens the docket in clearCloud and automatically constructs an EIP-712 dispatch payload to spin up an initial 4-outcome prediction pool in `veracities.social` (`ValidationMarket.sol`).
6. **Deliberation Commences**: Civic jurors are summoned via sortition, and prediction traders can begin wagering conviction in the validation market.
