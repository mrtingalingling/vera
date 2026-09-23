# Vera Ecosystem Architecture Blueprint

## 1. High-Level System Architecture

The Vera ecosystem comprises a modular, decentralized stack separating client runtimes, identity broker networks, and public truth-settlement interfaces:

```mermaid
graph TD
    subgraph Layer0 ["Layer 0 & Ingestion Engine (mrtingalingling/vera)"]
        V_Engine["Core Heuristics & Local AI<br/>(localAiService.js)"]
        V_Nano["On-Device AI Engine<br/>(Chrome Gemini Nano Streaming)"]
        V_P2P["Gossip Swarm Attestation<br/>(p2pNode.js)"]
        V_DOM["DOM Parser & WOT Highlighter<br/>(scannerService.js)"]
        V_DB["Offline Storage Engine<br/>(VeraDB IndexedDB)"]
        V_Scrub["Private Messaging PII Scrubber (Feature 1.2)<br/>(piiScrubberService.js)"]
    end

    subgraph LayerProtocol ["Protocol & Settlement Backend (mrtingalingling/veracities.social)"]
        P_Auth["Identity Broker Interface<br/>(authProvider.js)"]
        P_ATProto["ATProto Agent & DID:PLC<br/>(atprotoProvider.js)"]
        P_Web3["NFT & Web3 SIWE Interface<br/>(web3NftProvider.js)"]
        P_Market["Validation Market Registry<br/>(validationMarket.js)"]
        P_DAO["Epistemic DAO Governance Registry<br/>(daoRegistry.js)"]
        P_Settle["Courtroom Settlement Protocol<br/>(14-day cold 94%/6% fee & challenge bonds)"]
    end

    subgraph LayerApp ["Unified Social Application (mrtingalingling/clearCloud)"]
        A_Feed["The Feed & Relational Circles (Feature 1.1)<br/>(Close Friends, Acquaintances, Network)"]
        A_Grounded["Groundedness Index (G) & Hidden Rep<br/>(feedVerifier.js)"]
        A_Court["The Courtroom Deliberation Forum (Feature 1.3)<br/>(Compound Claim DAG & Juror Voting)"]
        A_Overlay["Social Overlays<br/>(X, Bluesky, Reddit, YouTube)"]
    end

    %% Cross-Repo Interconnections
    Layer0 -->|"Exports @vera/core API (local AI, PII scrubber, P2P)"| LayerApp
    Layer0 -->|"Supplies verified attestations"| LayerProtocol
    LayerProtocol -->|"Provides ATProto Auth & Staking Settlement Protocol"| LayerApp
```

---

## 2. Layer Definitions & Repositories

### Layer 0 & Ingestion Engine ([`mrtingalingling/vera`](https://github.com/mrtingalingling/vera))
- **Execution Environment**: Chrome Extension (MV3), Browser Web Worker, Node.js.
- **Key Modules**:
  - `localAiService.js`: On-device Chrome Gemini Nano streaming & local heuristic pipeline.
  - `piiScrubberService.js` (**Feature 1.2**): On-device zero-leakage PII scrubber and core claim extractor for WhatsApp Web, Telegram Web, Signal, and WeChat.
  - `p2pNode.js`: Decentralized browser gossip swarm for peer attestation.
  - `scannerService.js`: Bi-directional active tab scanning and 4-category DOM highlights.
  - `db.js`: Zero-leakage client-side IndexedDB persistence (`VeraDB` v1).
  - `googleDriveService.js`: Live REST grounding for Google Docs and Sheets.
- **Consumption Mode**: Exposes `@vera/core` ES module (`frontend/src/index.js`) for downstream applications and protocols.

---

### Protocol & Settlement Backend ([`mrtingalingling/veracities.social`](https://github.com/mrtingalingling/veracities.social))
- **Execution Environment**: Node.js / Cloud Run / Serverless Edge / Smart Contract Interfaces.
- **Key Modules**:
  - `src/identity/atprotoProvider.js`: ATProto authentication (`@atproto/api`), handle validation (`user.bsky.social`), DID PLC directory resolution (`did:plc:...`).
  - `src/identity/web3NftProvider.js`: Extensible Web3 interface for Ethereum/EVM wallet signatures (EIP-4361 / SIWE) and NFT token-gating.
  - `src/market/validationMarket.js`: Validation Market prediction registry, truth stake pools, and automated oracle payout calculation.
  - `src/governance/daoRegistry.js`: Epistemic DAO registry ("EnDAOsment") with weighted voting, proposal lifecycle, and quorum thresholds.
  - `src/settlement/courtroomSettlement.js`: Courtroom settlement rules (14-day cold case 94% refund / 6% fee, anti-spam challenge bond escrow, jury consensus tally protocol).

---

### Unified Social Application ([`mrtingalingling/clearCloud`](https://github.com/mrtingalingling/clearCloud))
- **Execution Environment**: Web Application / Progressive Web App.
- **Key Modules**:
  - `src/feed/` (**Feature 1.1**): Relational Circles (Tier 1 Close Friends, Tier 2 Friends/Acquaintances, Tier 3 Network-Wide), Groundedness Index ($G$) ranking, and Asymmetric Hidden Reputation engine.
  - `src/courtroom/` (**Feature 1.3**): The Courtroom deliberation docket, Falsifiability Gatekeeper, Compound Claim DAG hierarchical decomposition, and Juror voting interface.
  - `src/social/overlayService.js`: Social card and badge generator for Bluesky, X/Twitter, Reddit, and YouTube.
  - Consumes `veracities.social` for identity/market/settlement protocol and `@vera/core` for on-device AI & PII scrubbing.
