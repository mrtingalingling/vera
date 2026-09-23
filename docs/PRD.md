# Product Requirements Document (PRD): Vera Ecosystem

**Project**: Vera — Decentralized AI-Agentic Fact Verification & Epistemic Social Network  
**Author / Team**: Core Platform Architecture  
**Status**: APPROVED SPECIFICATION  
**Target Release**: Phased (Layer 0 Active; Layers 1–3 Future Concurrent Expansions)  

---

## 1. Executive Summary & Core Mission

### 1.1 The Core Problem
The modern information landscape suffers from three compounding failures:
1. **Cognitive & Sensationalist Overload**: Algorithmic feeds prioritize emotional engagement and rage bait over factual truth and intellectual nuance.
2. **Centralized & Fragmented Trust**: Centralized fact-checking authorities are increasingly mistrusted, politicized, or unable to scale to billions of daily micro-claims.
3. **Misaligned Incentives**: There are no economic or social rewards for being grounded, intellectually honest, or empathetic; outrage generates clicks, while verification is laborious and unpaid.

### 1.2 The Vera Thesis: "Truth Settlement"
Vera transforms verification from a passive, centralized chore into an active, game-theoretically sound **decentralized epistemic ecosystem**. 

Rather than treating social networking, financial markets, and decentralized governance as isolated, sequential tiers, Vera connects them into an **interwoven truth-settlement engine**:
* **Layer 1 (The Social Suite)**: The human interaction engine where claims are discovered, filtered, and debated. **Layer 1 has a direct, concurrent effect on Layers 2 and 3**.
* **Layer 2 (The Validation Market)**: The economic incentive engine—**all about making money from validating facts** via poker-style wagering, parleys, and derivative hedging.
* **Layer 3 (The Epistemic DAO)**: The decentralized governance engine—**all about future engagement and ecosystem improvement**, allocating anonymous voting weight based on intellectual honesty, factual grounding, and empathy.

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

## 2. System Architecture & Layer Relationships

### 2.1 Layer Classification
* **Layer 0 (Vera Core)**: **ACTIVE BASELINE (In Repository)**. Foundational client, extension popup, unified build, BYOM guest/cloud agent, mini-charts, and 4-category highlighting.
* **Layers 1, 2, and 3**: **FUTURE CONCURRENT EXPANSIONS**.

### 2.2 The Direct Interconnection Principle (Non-Sequential Dynamics)
Layer 1 does **not** sit beneath Layer 2 and Layer 3 in a slow waterfall. Instead, user activity in Layer 1 continuously and concurrently powers both Layer 2 and Layer 3:
1. **Layer 1 $\rightarrow$ Layer 2 (Claim Monetization)**: A trending claim or disputed assertion in ClearCloud or the Courtroom directly seeds a Validation Market contract, allowing participants to stake capital, raise, or fold as evidence develops. Courtroom jury performance directly determines eligibility and weighting in Validation Market settlement oracles.
2. **Layer 1 $\rightarrow$ Layer 3 (Reputation & Governance)**: The quality of a user's contributions, the factual rigor of their posts, their willingness to steel-man opposing views, and their lack of rage-bait directly alter their hidden reputation. This score feeds the ZK-SNARK identity bridge granting voting power in the DAO.

---

## 3. Layer 0: Vera Core Agent (Current Active Baseline)

Vera Core serves as the foundational client engine running inside the user's browser, available as both a web standalone frame and a browser extension.

### 3.1 Unified Svelte 5 Runtime & Build Pipeline
* **Signal Reactivity**: Built with Svelte 5 Runes (`$state`, `$derived`, `$effect`) for zero-VDOM, fine-grained text node rendering.
* **Unified Vite Compilation**: `frontend/vite.config.js` maintains a single source of truth, compiling into `frontend/static/dist/` and automatically synchronizing to `extension/dist/`.
* **Portable Frame Mounting**: Both `frontend/static/frame.html` and `extension/popup.html` mount `#svelte-frame-root` with zero drift.

### 3.2 Dual-Execution AI Architecture
* **Local In-Browser Engine**: Web Worker offload for WebGPU-accelerated models (`localAiService.js`) and direct integration with Chrome Built-In AI (Gemini Nano).
* **Cloud Reasoning Engine & BYOM 1-Click**:
  * **Frictionless Guest Agent**: 1-click in-app activation setting `provider: "guest_agent"` with zero credentials required; unlocks uncapped queries (`remaining: 999`).
  * **Google Account OAuth**: Default authenticated path using Chrome Identity or web OAuth tokens.
  * **Custom AI Providers**: Direct API key connections to Gemini, OpenAI, Anthropic, xAI Grok, DeepSeek, and OpenRouter.
  * **Custom Remote Backend Endpoint URL**: Configurable routing allowing deployment to custom Cloud Run or Agent Gateway instances.

### 3.3 Verifiable Metrics, DOM Highlighting & Time-Bound Access
* **Time-Bound Tab Permissions**:
  * Granular duration modal: `Just once`, `For 15 Minutes`, `For 1 Hour`, and `Always for this domain` (`∞`).
  * Animated rotating SVG hourglass banner in active tab toolbar showing real-time countdown (`Active: MM:SS`).
* **Discrete Actions**:
  * **"Scan Page"**: Extract page text and analyze conversationally in Cockpit chat.
  * **"Highlight Claims"**: In-page visual annotation marking claims directly on host DOM with WOT hover cards.
* **4-Category Verdict Classification**:
  1. `verified` (Emerald): Grounded in primary factual sources.
  2. `disputed` (Amber): Conflicting evidence across reliable authorities.
  3. `misinformed` (Rose): Definitively refuted claims or hallucinations.
  4. `need-additional-context` (Purple): Missing critical qualifiers or nuance.
* **Dual Mini-Chart Display**:
  * **Persistent Dashboard**: Header tracks cumulative session and page-level Fact vs. Opinion/Speculation ratios.
  * **Embedded Response Cards**: Every fact-check message renders its own claim-specific breakdown gauge.
* **P2P Transport**: Foundational libp2p browser node integration for decentralized peer-to-peer data transport (`p2pNode.js`).

### 3.4 Grounding Evidence & Fact Catalog Drawers
* **Evidence Sources Drawer (`SourceEvidencePanel.svelte`)**:
  * User-provided custom research notes and URLs.
  * Native linking to Google Docs and Google Sheets truth matrices.
  * Dynamic premise toggle synchronization (`syncActivePremises`) updating agent context on the fly.
  * Community pool sharing.
* **Fact Catalog & Database Metrics Drawer (`CatalogPanel.svelte`)**:
  * Direct submission of fact-check assertions to Firestore with 4-category verdicts and accuracy / falsehood / speculation percentages.
  * Live querying of database history table.

---

## 4. Layer 1: The Social Suite (Future Specification)

The Social Suite is the human interaction layer designed to cultivate authentic relationships, eliminate sensationalist rage-bait, and facilitate structured, adversarial truth discovery.

### 4.1 Feature 1.1 — ClearCloud (Decentralized Social Media)
ClearCloud combines the real-time discourse of Bluesky/Twitter with the multimedia lifestyle context of Instagram/Little Red Book, built upon a **relational-first, groundedness-ranked** foundation.

#### A. Relational Proximity Circles (3-Tiered Navigation)
Global engagement algorithms are replaced by three progressively expanding circles:
1. **Tier 1: Close Friends**
   * Displays exclusively personal updates from intimate social contacts.
   * **Rage-Bait Scrubber**: Users can enable *"Filter Out Non-Personal Content"*. If a close friend reposts political rage-bait, viral outrage, or non-personal memes, it is automatically hidden from Tier 1, preserving intimacy.
2. **Tier 2: Friends & Acquaintances**
   * Direct contacts, colleagues, and mutual interactions who are not in the close circle.
3. **Tier 3: Network-Wide**
   * Public figures, news networks, institutions, and global creators.

#### B. Groundedness Score Algorithmic Ranking
Within Tiers 2 and 3, posts are prioritized by their **Groundedness Index** ($G$):
$$G = \frac{\text{Verifiable Fact Content}}{\text{Verifiable Facts} + \text{Unsubstantiated Speculation} + (\text{Debunked Claims} \times 3)}$$
* Posts with high factual grounding receive preferential distribution.
* Speculation and opinions are flagged with Vera's purple gauge.
* Content with high falsehood or ungrounded claims is algorithmically suppressed.

#### C. Hidden Reputation Engine & Asymmetric Trust Dynamics
To protect the social network from bad-faith gaming, performative virtue-signaling, and clout-chasing, each user possesses an internal **Hidden Reputation Score**:
1. **Hidden by Default**: The score is tracked silently by the protocol and is **not displayed as a public vanity badge**. This prevents sybil actors from optimizing vanity metrics.
2. **Asymmetric Accrual Dynamics ("Trust is Hard to Build, Fast to Lose")**:
   * **High, Swift Penalties**: Posting divisive content, unbacked rage-bait, conspiratorial fabrications, or claims debunked by the Courtroom incurs immediate, severe reputation deductions.
   * **Slow, Deliberate Accrual**: High-quality, verified, factually grounded, and constructive posts increase reputation gradually over extended periods of consistent intellectual honesty.
3. **Direct Algorithmic Visibility Impact**:
   * A user's hidden reputation directly dictates **how likely other users are to see their posts** across Tier 2 (Friends) and Tier 3 (Network-Wide).
   * **High-Reputation Creators**: Enjoy amplified organic reach and higher visibility across acquaintance feeds and network recommendations.
   * **Low-Reputation / Chronic Rage-Baiters**: Their non-personal posts are automatically deprioritized and throttled across non-close circles, suffocating disinformation at the distribution level without requiring heavy-handed censorship.

---

### 4.2 Feature 1.2 — Private Messaging Add-on (WhatsApp, Telegram, WeChat)
Enables fact-checking directly inside private web messaging environments while guaranteeing strict zero-knowledge privacy.

#### A. Privacy-First Local PII Scrubber (Zero Data Leakage)
1. **Client-Side Ingestion**: When a user selects a message to verify inside WhatsApp Web, Telegram Web, or WeChat Web, text is routed to an isolated **WebGPU Web Worker**.
2. **Local PII Stripping**: A local on-device NER (Named Entity Recognition) model scrubs:
   * Names, phone numbers, email addresses, handles.
   * Specific temporal or geographical identifiers.
   * Private chatter and conversational pleasantries.
3. **Core Claim Extraction**: Converts *"Hey Dave, my doctor friend at Mayo Clinic says drinking warm water with salt cures COVID"* into:
   `Claim: Drinking warm water with salt cures COVID-19.`

#### B. Explicit User Opt-In for Cloud Verification
* The sanitized claim is presented in an in-app verification preview:
  > *"Sanitized claim to verify: 'Drinking warm water with salt cures COVID-19'. Zero private or personal information will leave your machine."*
* The user provides explicit opt-in confirmation before sending the sanitized claim to cloud reasoning engines or the decentralized Courtroom.

---

### 4.3 Feature 1.3 — The Courtroom (Deliberation Forum)
A structured, adversarial fact-deliberation forum where claims highlighted from ClearCloud, web pages, or messaging apps are tried as formal "cases".

#### A. The Falsifiability Gatekeeper
* Vera AI presides as a strict gatekeeper:
* **Verifiable Claims Permitted**: "Company X filed for bankruptcy on Tuesday" or "Atmospheric CO2 reached 420 ppm" $\rightarrow$ **Case Admitted**.
* **Unverifiable Subjective Claims Rejected**: "God is real", "Jazz is better than rock", or "The senator is wicked" $\rightarrow$ **Rejected with explanatory tag**: *"Unverifiable subjective statement, aesthetic preference, or metaphysical belief."*

#### B. Case Lifecycle & Resolution Triggers
Cases remain open, living dossiers without an arbitrary hard deadline, concluding via one of three paths:
```
                      ┌────────────────────────────┐
                      │    Case Formally Opened    │
                      └─────────────┬──────────────┘
                                    │
           ┌────────────────────────┼────────────────────────┐
           ▼                        ▼                        ▼
┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐
│  1. Conclusive Proof │ │ 2. Stale & Cold Case │ │ 3. Hierarchical DAG  │
│                      │ │                      │ │    Decomposition     │
│  Overwhelming jury   │ │  No new activity     │ │  Complex case splits │
│  consensus within    │ │  for 2 weeks.        │ │  into discrete sub-  │
│  2 weeks of proof.   │ │  94% wager refunded  │ │  claims. Recombines  │
│  Verdict recorded.   │ │  (6% platform fee).  │ │  upon sub-resolutions│
└──────────────────────┘ └──────────────────────┘ └──────────────────────┘
```
1. **Conclusive Proof**: An overwhelming supermajority of anonymous jury votes aligns with definitive primary documentation within 2 weeks of submission.
2. **Stale & Cold**: If a case receives no new evidence or verification activity for 14 consecutive days, it enters "Cold Status":
   * **94% of all deposited wagers are refunded** to participants.
   * **6% platform maintenance fee** is retained.
   * The dossier turns grey and archived until a new participant stakes a wager to reopen it.
3. **Hierarchical Case Decomposition (Claim DAG)**:
   * When a claim contains multiple interdependent assertions (e.g., *"Vaccine X was banned in Japan because it caused heart attacks"*), Vera decomposes it into a Directed Acyclic Graph (DAG) of sub-cases:
     * *Sub-Case A*: Was Vaccine X banned in Japan?
     * *Sub-Case B*: What were the documented medical causes?
   * The master case resolves logically once all child nodes conclude.
4. **Case Reopening, Appeals & Retrial Mechanism (New Wager / Challenge Bond)**:
   * A settled or cold case may be formally reopened for retrial through a **new staked wager**, ensuring the historical record remains dynamic, falsifiable, and protected against premature or biased consensus:
     * **Trigger A: Fresh Material Evidence**: New verifiable primary documentation, newly declassified records, scientific replications, or cryptographic proofs that were unavailable or undiscovered during the original deliberation period.
     * **Trigger B: Voter Participation Deficit or Probable Bias**:
       * *Early-Stage Community Vulnerability*: Cases decided when the platform was nascent and absolute voter count was small.
       * *Low Relative Quorum*: When jury turnout on the case was statistically negligible or unrepresentative relative to the broader active platform population.
       * *Factional / Sybil Brigading Bias*: Statistical anomaly detection indicating localized voter coordination or echo-chamber upvoting skewed the initial verdict.
   * **Anti-Spam Challenge Bond**:
     * To prevent bad-faith denialism and endless frivolous retrials of settled facts, reopening requires an **escalated Challenge Wager / Staking Bond** (skin in the game).
     * **If the Retrial Reaffirms the Original Verdict**: The challenger forfeits their bond, which is distributed as a bounty reward to the reaffirming jurors and the protocol reserve.
     * **If the Retrial Overturns the Original Verdict**: The challenger's bond is returned with a substantial bounty reward from the retrial pool, the public verdict is revised, and the historical correction is etched into the decentralized ledger.
   * **Dynamic Quorum Scaling**:
     * The required voter quorum for retrial scales dynamically with the size of the active ecosystem ($Q_{appeal} = \max(N_{min}, 5\% \times \text{Active Platform Community})$), preventing small factions from defending a biased initial outcome.

#### C. The Jury & Judge Governance Model
* **The Jury (Community)**: Users anonymously upvote or downvote arguments strictly based on the **rigor of reasoning, source credibility, and absence of logical fallacies**.
* **The Judge (AI Synthesis)**: The AI does not decide guilt or truth unilaterally; it acts as a **judicial guardrail**, ensuring evidence meets standards of relevance, flagging rhetorical distortions, and summarizing consensus.

---

## 5. Layer 2: The Validation Market (Future Specification)

**Core Purpose: Making money from validating facts.**  
The Validation Market is an economic truth-settlement protocol where users monetize analytical rigor, research, and source verification.

### 5.1 Account Linking & Wallets
* Users maintain a dedicated Validation Market profile linked cryptographically to their Vera identity.
* Supports multi-currency escrow: fiat on-ramps (Stripe/Wise) and Web3 crypto deposits (USDC, ETH, Solana).

### 5.2 Poker-Style Wagering Mechanics
Instead of static binary prediction markets, Vera models verification as dynamic **Evidence Round Wagering**:

```
[Round 1: Pre-Flop] ───► [Round 2: Evidence Drop] ───► [Round 3: Cross-Exam] ───► [Showdown]
  Initial Claim           Primary Source Filed            Expert Testimony         Settlement
  Bet / Check             Raise / Call / Fold             Re-raise / Fold          Jury Decides
```

* **Bet / Check**: Users take initial positions on a claim's veracity based on public reporting.
* **Raise / Call**: As participants introduce verifiable documents, sensor data, or primary records, players raise the stakes or call.
* **Fold (Risk Mitigation)**: If an opposing participant introduces definitive primary evidence disproving your position, you may **Fold** before the final showdown, forfeiting only your prior bets and saving the remainder of your capital.

### 5.3 Parleys & Derivatives
* **Truth Parleys**: Users bundle multiple distinct claims into a high-conviction slip (e.g., *"Claim A is Misinformed AND Claim B is Verified AND Claim C goes Cold"*), multiplying potential payouts.
* **Hedge Options**: Users staking on long-term corporate or geopolitical claims can purchase derivative puts/calls against claim resolution outcomes to protect their staking capital against sudden evidence drops.

### 5.4 Settlement Oracle Architecture
Wagers are settled deterministically using a multi-tiered oracle mechanism:
1. **Decentralized Courtroom Jury Verdict**: Cryptographic tally of supermajority votes from validated high-reputation community members.
2. **On-Chain Primary Evidence Attestation**: Cryptographic hashes of immutable sources (Etherscan, government registries, SEC filings, signed IPFS payloads) verified via smart contracts.
3. **Appellate Reopening & Dispute Window**: Settled wagers are subject to a time-locked challenge window. Staking an escalated challenge bond citing material new evidence or demonstrating statistically low/biased voter turnout triggers a Courtroom retrial before escrowed funds are permanently released.

---

## 6. Layer 3: The Epistemic DAO (Future Specification)

**Core Purpose: Future engagement and ecosystem improvement.**  
The Epistemic DAO governs platform evolution, algorithmic weights, dispute resolution rules, and treasury allocation without relying on plutocratic token voting.

### 6.1 Epistemic & Empathic Reputation Metrics
Voting power is earned through a multi-dimensional **Epistemic Quotient (EQ)** derived directly from Layer 1 and Layer 2 behavior:

$$EQ = w_1 \cdot \text{Factuality} + w_2 \cdot \text{Bridging Consensus} + w_3 \cdot \text{Steel-Manning} - w_4 \cdot \text{Toxicity}$$

1. **Factuality Accuracy**: Track record of successful, verified contributions in ClearCloud, the Courtroom, and the Validation Market.
2. **Bridging Consensus**: Modeled after the Polis / Community Notes bridging algorithm—rewarding arguments that persuade participants across ideological divides rather than within echo chambers.
3. **Steel-Manning**: Quantified bonus for users who accurately articulate the strongest version of an opposing stance before countering it.
4. **Local Toxicity Suppression**: On-device NLP penalizing ad-hominem attacks, emotional manipulation, and bad-faith rhetoric.

### 6.2 Anonymous ZK-SNARK Identity Bridge
To protect users from doxxing, state censorship, and social retaliation, the DAO operates on a decoupled, separate governance infrastructure:

```
┌───────────────────────────────────────┐         ┌───────────────────────────────────────┐
│        Vera Platform Activity         │         │         Separate DAO Governance       │
│  • Layer 1 ClearCloud Quality         │         │  • Protocol Upgrade Voting            │
│  • Courtroom Jury Accrual             │         │  • Algorithmic Weight Adjustments     │
│  • Validation Market Accuracy         │         │  • Community Treasury Allocation      │
└──────────────────┬────────────────────┘         └───────────────────▲───────────────────┘
                   │                                                  │
                   ▼                                                  │
         ┌───────────────────┐                              ┌─────────┴─────────┐
         │ Epistemic State & │                              │ Zero-Knowledge    │
         │ Private Merkle Tree│                              │ Proof Verification│
         └─────────┬─────────┘                              └─────────▲─────────┘
                   │                                                  │
                   └────────────────► [ZK-SNARK Prover] ──────────────┘
                                      (Semaphore Protocol)
                                      "I am a Tier-3 Truth Arbiter
                                      with EQ > 85, without revealing
                                      my wallet, name, or history."
```

* **Semaphore / ZK-SNARK Protocol**: The user generates a client-side Zero-Knowledge proof attesting:
  > *"I control an account in Vera with Epistemic Tier 3 (>85 EQ), but I reveal nothing about my user ID, wallet address, reading history, or specific votes."*
* The separate DAO system accepts the proof and records the anonymous vote, guaranteeing censorship-resistant governance.

---

## 7. Technical Stack Matrix

| Subsystem | Technology | Purpose | Status |
| :--- | :--- | :--- | :--- |
| **Frontend Frame** | Svelte 5 (Runes) + Vite | Universal cockpit for web frame and extension popup | **Active (Layer 0)** |
| **AI Client Engine** | WebGPU (WebLLM) + Cloud API | In-browser zero-leakage inference + BYOM cloud fallback | **Active (Layer 0)** |
| **P2P Transport** | libp2p + GossipSub + WebRTC | Serverless claim sync, peer routing, and resilience | **Active (Layer 0)** |
| **Messaging Scrubber** | OnnxRuntime-Web / WebGPU | Local client-side PII stripping for chat add-ons | **Future (Layer 1)** |
| **Social Feed Engine** | Yjs / Automerge CRDTs | Decentralized relational graph and ClearCloud feed | **Future (Layer 1)** |
| **Validation Contracts** | Solidity / EVM + Solana SVM | Poker-style escrow, wager pooling, and settlement oracles | **Future (Layer 2)** |
| **DAO Identity Bridge**| Semaphore / Circom / SnarkJS | Anonymous zero-knowledge reputation attestation | **Future (Layer 3)** |

---

## 8. Concurrent Evolution Roadmap

Because Layer 1 directly feeds Layer 2 and Layer 3, their development is designed to progress **concurrently** rather than sequentially:

```
[Layer 0: Active Baseline] ─────────────────────────────────────────────► (Continuous Polish)
  • Svelte 5 Universal Frame & Vite build
  • BYOM 1-Click Guest preset & provider portal
  • Real-time 4-verdict DOM highlighting & mini-charts

[Layer 1: Social Suite] ────────────────────────────────────────────────► (Concurrent Track A)
  • Local WebGPU PII Scrubber (Chat Add-on)
  • ClearCloud 3-Tier Navigation & Hidden Reputation Engine
  • Courtroom Falsifiability Gatekeeper & DAG Lifecycles

[Layer 2: Validation Market] ───────────────────────────────────────────► (Concurrent Track B)
  • Poker-style Evidence Round Escrow Contracts
  • Truth Parleys & Hedging Derivatives
  • Dual Settlement Oracles (Courtroom Jury + On-Chain Hashes)

[Layer 3: Epistemic DAO] ───────────────────────────────────────────────► (Concurrent Track C)
  • Epistemic Quotient (EQ) Cross-Faction Bridging Metrics
  • Semaphore ZK-SNARK Client-Side Reputation Provers
  • Decoupled Anonymous Governance Execution
```

---

## 9. Verification & Success Metrics

1. **Epistemic Precision**: Ratio of Courtroom-settled claims whose verdicts remain undisputed over 12 months (>98%).
2. **Hidden Reputation Efficacy**: 90%+ reduction in non-personal rage-bait impressions across Tiers 2 & 3 within 30 days of bad-faith activity.
3. **Privacy Integrity**: Zero instances of PII leaving the local browser thread during private messaging grounding.
4. **Market Game-Theoretic Robustness**: Resistance to 51% sybil-wager attacks in the Validation Market via Courtroom jury checks.
5. **Discourse Health**: Positive delta in cross-faction bridging consensus score across controversial claims in ClearCloud.
