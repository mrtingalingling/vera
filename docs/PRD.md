# Product Requirements Document (PRD): Vera Ecosystem

**Project**: Vera — Decentralized AI-Agentic Fact Verification & Epistemic Social Network  
**Author / Team**: Core Platform Architecture  
**Status**: APPROVED SPECIFICATION  
**Target Release**: Phased (Layer 0 Active; Layers 1–3 Future Milestones)  

---

## 1. Executive Summary & Core Mission

### 1.1 The Core Problem
The modern information landscape suffers from three compounding failures:
1. **Cognitive & Sensationalist Overload**: Algorithmic feeds prioritize emotional engagement and rage bait over factual truth and intellectual nuance.
2. **Centralized & Fragmented Trust**: Centralized fact-checking authorities are increasingly mistrusted, politicized, or unable to scale to billions of daily micro-claims.
3. **Misaligned Incentives**: There are no economic or social rewards for being grounded, intellectually honest, or empathetic; outrage generates clicks, while verification is laborious and unpaid.

### 1.2 The Vera Thesis: "Truth Settlement"
Vera transforms verification from a passive, centralized chore into an active, game-theoretically sound **decentralized epistemic ecosystem**. 

By coupling an omnipresent **in-browser AI fact-checking copilot** with a **relational-first social network**, a **poker-style validation market**, and an **anonymous, merit-weighted DAO**, Vera aligns individual financial incentives, social connection, and collective intelligence with objective reality.

```
                           ┌─────────────────────────────────────────┐
                           │         Layer 3: Epistemic DAO          │
                           │   • Anonymous ZK-SNARK Reputation       │
                           │   • Empathy & Bridging Voting Power     │
                           │   • Ecosystem Governance & Upgrades     │
                           └────────────────────▲────────────────────┘
                                                │ Anonymous Attestation
                           ┌────────────────────┴────────────────────┐
                           │      Layer 2: Validation Market         │
                           │   • Poker-Style Wagering (Bet/Raise/Fold)│
                           │   • Parleys & Derivative Options        │
                           │   • On-Chain + Jury Settlement Oracles  │
                           └────────────────────▲────────────────────┘
                                                │ Truth Settlement
                           ┌────────────────────┴────────────────────┐
                           │         Layer 1: Social Suite           │
                           │   1.1 ClearCloud (Relational Feed)      │
                           │   1.2 Chat Add-on (Local PII Scrubber)  │
                           │   1.3 Courtroom (Deliberation DAGs)     │
                           └────────────────────▲────────────────────┘
                                                │ Grounded Claims
┌───────────────────────────────────────────────┴───────────────────────────────────────────────┐
│                               Layer 0: Vera Core Agent (ACTIVE)                               │
│  • Svelte 5 Runes Architecture (Unified Web Cockpit & Chrome Extension Popup)                 │
│  • Hybrid In-Browser (WebGPU) + Cloud Reasoning Engines (1-Click Guest & Custom Keys)         │
│  • Real-Time 4-Category DOM Highlighting & Persistent / Embedded Fact vs. Opinion Mini-Charts │
│  • libp2p P2P Synchronization Transport Layer                                                 │
└───────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. System Architecture & Layer Boundaries

### Layer Scope Classification
* **Layer 0 (Vera Core)**: **ACTIVE / IN PRODUCTION (Repository Base)**.
* **Layers 1, 2, and 3**: **FUTURE SYSTEM EXPANSIONS**.

---

## 3. Layer 0: Vera Core Agent (Current Active Baseline)

Vera Core serves as the foundational client engine running inside the user's browser, available as both a web standalone frame and a browser extension.

### 3.1 Unified Svelte 5 Runtime & Build Pipeline
* **Signal Reactivity**: Built entirely with Svelte 5 Runes (`$state`, `$derived`, `$effect`) for zero-VDOM, fine-grained text node rendering.
* **Unified Vite Compilation**: `frontend/vite.config.js` maintains a single source of truth, compiling into `frontend/static/dist/` and automatically synchronizing to `extension/dist/`.
* **Portable Frame Mounting**: Both `frontend/static/frame.html` and `extension/popup.html` mount `#svelte-frame-root` with zero drift.

### 3.2 Dual-Execution AI Architecture
* **Local In-Browser Engine**: Web Worker offload for WebGPU-accelerated models (WebLLM / Transformers.js / ONNX Runtime Web).
* **Cloud Reasoning Engine & BYOM 1-Click**:
  * **Frictionless Guest Agent**: 1-click in-app activation setting `provider: "guest_agent"` with zero credentials required; unlocks uncapped queries (`remaining: 999`).
  * **Google Account OAuth**: Default authenticated path using Chrome Identity or web OAuth tokens.
  * **Custom AI Providers**: Direct API key connections to Gemini, OpenAI, Anthropic, xAI Grok, DeepSeek, and OpenRouter.

### 3.3 Verifiable Metrics & DOM Highlighting
* **4-Category Verdict Classification**:
  1. `verified` (Emerald): Grounded in primary factual sources.
  2. `disputed` (Amber): Conflicting evidence across reliable authorities.
  3. `misinformed` (Rose): Definitively refuted claims or hallucinations.
  4. `need-additional-context` (Purple): Missing critical qualifiers or nuance.
* **Dual Mini-Chart Display**:
  * **Persistent Dashboard**: Frame header tracks cumulative session and page-level Fact vs. Opinion/Speculation ratios.
  * **Embedded Response Cards**: Every fact-check message renders its own claim-specific breakdown gauge.
* **P2P Transport**: Foundational libp2p browser node integration for decentralized peer-to-peer data transport.

---

## 4. Layer 1: The Social Suite (Future Specification)

### 4.1 Feature 1.1 — ClearCloud (Decentralized Social Media)
ClearCloud is a multi-modal social feed (combining the status flow of Facebook/Bluesky with the rich visual lifestyle context of Instagram/Little Red Book), designed with a **relationship-first, groundedness-ranked** paradigm.

#### A. Relational Proximity Circles (3-Tiered Navigation)
The feed completely discards global engagement-maximizing algorithms in favor of 3 progressively expanding circles:
1. **Tier 1: Close Friends**
   * Displays exclusively updates from the user's intimate social circle.
   * **Rage-Bait Scrubber**: Users can toggle *"Filter Out Non-Personal Content"*. If a close friend reposts political outrage or non-personal memes, it is hidden from Tier 1, preserving intimacy.
2. **Tier 2: Friends & Acquaintances**
   * Direct contacts, colleagues, and mutual interactions with whom the user does not share close-circle status.
3. **Tier 3: Network-Wide**
   * Public figures, news outlets, organizations, and global creators.

#### B. Groundedness Score Algorithmic Ranking
Within Tiers 2 and 3, posts are ranked by their **Groundedness Index** ($G$):
$$G = \frac{\text{Verifiable Fact Content}}{\text{Verifiable Facts} + \text{Unsubstantiated Speculation} + (\text{Debunked Claims} \times 3)}$$
* Posts with high factual backing are promoted.
* Speculation is clearly tagged with Vera's purple gauge.
* Pure rage-bait without factual grounding is algorithmically deprioritized.

---

### 4.2 Feature 1.2 — Private Messaging Add-on (WhatsApp, Telegram, WeChat)
Enables users to fact-check claims directly within private web chats without sacrificing privacy.

#### A. Privacy-First Local PII Scrubber (Zero Data Leakage)
1. **Client-Side Ingestion**: When a user highlights a message or taps "Check with Vera" inside WhatsApp Web, Telegram Web, or WeChat Web, the text is passed to an isolated **WebGPU Web Worker**.
2. **Local PII Stripping**: A local in-browser NER (Named Entity Recognition) model removes:
   * Names, phone numbers, email addresses, handles.
   * Specific temporal or geographical identifiers.
   * Private contextual chatter.
3. **Core Claim Extraction**: Converts *"Hey John, my cousin at St. Jude Hospital said lemon water cures COVID"* into:
   `Claim: Lemon water cures COVID-19.`

#### B. Explicit User Opt-In for Cloud Verification
* The sanitized claim is displayed in a preview modal:
  > *"Sanitized claim to verify: 'Lemon water cures COVID-19'. No personal information will leave your device."*
* The user explicitly approves sending the sanitized claim to cloud reasoning engines or decentralized Courtroom archives.

---

### 4.3 Feature 1.3 — The Courtroom (Deliberation Forum)
A structured, adversarial fact-deliberation forum where claims highlighted from ClearCloud, web pages, or messaging apps are tried as formal "cases".

#### A. The Falsifiability Gatekeeper
* Vera AI presides as a strict gatekeeper.
* **Verifiable Facts Only**: "Company X filed for Chapter 11 bankruptcy" or "Global mean temperature rose 1.2°C" $\rightarrow$ **Case Accepted**.
* **Subjective / Metaphysical Claims Rejected**: "God exists", "Vanilla tastes better than chocolate", or "The government is morally corrupt" $\rightarrow$ **Rejected with explanatory tag**: *"Unverifiable subjective statement or metaphysical belief."*

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

#### C. The Jury & Judge Governance Model
* **The Jury (Community)**: Users anonymously upvote or downvote arguments strictly based on the **rigor of reasoning, source credibility, and absence of logical fallacies**.
* **The Judge (AI Synthesis)**: The AI does not decide guilt or truth unilaterally; it acts as a **judicial guardrail**, ensuring evidence meets standards of relevance, flagging rhetorical distortions, and summarizing consensus.

---

## 5. Layer 2: The Validation Market (Future Specification)

The Validation Market connects directly to the Courtroom, allowing users to monetize their research, source verification, and analytical rigor through game-theoretic staking.

### 5.1 Account Linking & Wallets
* Users maintain a dedicated Validation Market profile linked cryptographically to their Vera identity.
* Supports multi-currency escrow: fiat on-ramps (Stripe/Wise) and Web3 crypto deposits (USDC, ETH, Solana).

### 5.2 Poker-Style Wagering Mechanics
Unlike standard binary prediction markets (which are static "Yes/No" bets), Vera utilizes dynamic **Evidence Round Wagering**:

```
[Round 1: Pre-Flop] ───► [Round 2: Evidence Drop] ───► [Round 3: Cross-Exam] ───► [Showdown]
  Initial Claim           Primary Source Filed            Expert Testimony         Settlement
  Bet / Check             Raise / Call / Fold             Re-raise / Fold          Jury Decides
```

* **Bet / Check**: Users take initial positions on a claim's veracity based on initial public statements.
* **Raise / Call**: As participants introduce new verifiable documents, archival links, or sensor data, players can raise the pot or call.
* **Fold (Risk Mitigation)**: If an opposing participant introduces devastating primary evidence disproving your position, you may **Fold** before the final showdown, forfeiting only your prior bets and saving the remainder of your capital.

### 5.3 Parleys & Derivatives
* **Truth Parleys**: Users bundle multiple distinct claims into a high-conviction slip (e.g., *"Claim A is Misinformed AND Claim B is Verified AND Claim C goes Cold"*), multiplying potential payouts.
* **Hedge Options**: Users staking on long-term corporate or geopolitical claims can buy derivative puts/calls against claim resolution outcomes to protect their staking capital against sudden evidence revelations.

### 5.4 Settlement Oracle Architecture
Wagers are settled deterministically using a dual-oracle mechanism:
1. **Decentralized Courtroom Jury Verdict**: Cryptographic tally of supermajority votes from validated high-reputation community members.
2. **On-Chain Primary Evidence Attestation**: Cryptographic hashes of immutable sources (Etherscan, government registries, SEC filings, signed IPFS payloads) verified via smart contracts.

---

## 6. Layer 3: The Epistemic DAO (Future Specification)

The Epistemic DAO provides community ownership over Vera's algorithms, dispute resolution rules, and treasury.

### 6.1 Epistemic & Empathic Reputation Metrics
Voting power is **not** purchased with capital (1-token-1-vote is prohibited to prevent plutocracy). Instead, voting power is earned through a multi-dimensional **Epistemic Quotient (EQ)**:

$$EQ = w_1 \cdot \text{Factuality} + w_2 \cdot \text{Bridging Consensus} + w_3 \cdot \text{Steel-Manning} - w_4 \cdot \text{Toxicity}$$

1. **Factuality Accuracy**: Track record of successful, verified contributions in the Courtroom and Validation Market.
2. **Bridging Consensus**: Modeled after the Polis / Community Notes bridging algorithm—rewarding arguments that persuade participants across ideological divides rather than within echo chambers.
3. **Steel-Manning**: Quantified bonus for users who accurately articulate the strongest version of an opposing stance before countering it.
4. **Local Toxicity Suppression**: On-device NLP penalizing ad-hominem attacks, emotional manipulation, and bad-faith rhetoric.

### 6.2 Anonymous ZK-SNARK Identity Bridge
To protect users from doxxing, state censorship, and social retaliation, the DAO operates on a separate, decoupled infrastructure:

```
┌─────────────────────────┐               ┌─────────────────────────┐
│     Vera Ecosystem      │               │     Separate DAO App    │
│  • Browsing History     │               │  • Governance Proposals │
│  • Social Interactions  │               │  • Voting Executions    │
│  • Validation Activity  │               │  • Treasury Allocations │
└────────────┬────────────┘               └────────────▲────────────┘
             │                                         │
             ▼                                         │
   ┌───────────────────┐                     ┌─────────┴─────────┐
   │ Epistemic State & │                     │ Zero-Knowledge    │
   │ Private Merkle Tree│                     │ Proof Verification│
   └─────────┬─────────┘                     └─────────▲─────────┘
             │                                         │
             └───────────► [ZK-SNARK Prover] ──────────┘
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

## 8. Phased Implementation Roadmap

```
Phase 0 (Completed): Layer 0 Baseline
  • Svelte 5 Universal Frame & Vite multi-target build (Web + Extension)
  • BYOM 1-Click Guest preset & custom AI provider portal
  • Real-time 4-verdict DOM highlighting & embedded/persistent mini-charts

Phase 1: Privacy PII Scrubber & Messaging Add-ons (Q4 2026)
  • Web Worker with local NER model to strip names, phones, locations
  • WhatsApp Web, Telegram Web, and WeChat Web extension hooks
  • User opt-in modal before sending sanitized claims to cloud or P2P

Phase 2: ClearCloud & The Courtroom (Q1–Q2 2027)
  • 3-tier relational circles (Close Friends, Friends, Network-Wide)
  • Falsifiability gatekeeper AI agent (verifiable facts only)
  • Case lifecycle engine (Conclusive proof, 14-day cold refund, claim DAGs)
  • Anonymous reasoning upvote / judicial guardrail model

Phase 3: Validation Market & Poker Staking (Q2–Q3 2027)
  • Smart contract escrow for fiat & crypto (USDC/ETH/SOL)
  • Evidence-round wagering mechanics (Bet, Raise, Call, Fold)
  • Truth Parleys and hedging derivatives
  • Dual-oracle settlement (Courtroom Jury + on-chain primary hashes)

Phase 4: Epistemic DAO & ZK-Reputation (Q4 2027 – Q1 2028)
  • Multi-factor EQ algorithm (Factuality, Bridging Consensus, Steel-Manning, Low Toxicity)
  • Semaphore ZK-SNARK prover generating anonymous reputation attestations
  • Integration with external DAO governance and treasury execution
```

---

## 9. Verification & Success Metrics

1. **Epistemic Precision**: Ratio of Courtroom-settled claims whose verdicts remain undisputed over 12 months (>98%).
2. **Privacy Integrity**: Zero instances of PII leaving the local browser thread during private messaging grounding.
3. **Market Game-Theoretic Robustness**: Resistance to 51% sybil-wager attacks in the Validation Market via Courtroom jury checks.
4. **Discourse Health**: Positive delta in cross-faction bridging consensus score across controversial claims in ClearCloud.
