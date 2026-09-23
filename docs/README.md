# Vera Product Documentation Hub

Welcome to the central product documentation for **Vera** — the decentralized AI-agentic fact verification and epistemic grounding ecosystem.

---

## Document Index

| Document | Description | Status |
|---|---|---|
| [**PRD.md**](./PRD.md) | **Master Product Requirements Document**<br>Comprehensive architecture covering Layer 0 (Active Baseline), Layer 1 (Social Suite & Courtroom), Layer 2 (Truth Settlement & Validation Markets), and Layer 3 (Epistemic DAO Governance). | Approved Specification |
| [**features.md**](./features.md) | **Consolidated Features Specification**<br>Detailed technical specifications for all active capabilities (Svelte 5 frame, local AI worker, 4-verdict DOM highlighting, dual mini-charts, P2P swarm) and future expansions. | Active & Current |
| [**user_journeys.md**](./user_journeys.md) | **End-to-End User Journeys**<br>Step-by-step user workflows for on-device checking, extension page scanning, frictionless 1-click uncap, P2P gossip, and courtroom deliberation. | Active & Current |

---

## Architectural Layers Summary

1. **Layer 0: Vera Core Agent (ACTIVE BASELINE)**
   - Unified Svelte 5 Runes frame (`frontend/src/App.svelte`)
   - Dual-execution AI engine (Local in-browser Web Worker AI + Cloud BYOM)
   - Real-time active tab DOM scanning with 4-category highlighting and WOT hover cards
   - Facts vs. Opinion/Speculation persistent & embedded mini-charts
   - Foundational libp2p P2P transport for claim attestation gossiping
   - Single-command unified Vite build outputting to both web and extension

2. **Layer 1: Social Suite (Future Concurrent Expansion)**
   - ClearCloud: Groundedness-ranked social feed with 3-circle relationship reach and hidden asymmetric reputation engine
   - Private Messaging Add-on: WebGPU-powered local PII scrubber for WhatsApp, Telegram, WeChat
   - The Courtroom: Falsifiable deliberation forum with DAG case decomposition, 14-day cold refund, and challenge reopening

3. **Layer 2: Truth Settlement & Validation Markets (Future Concurrent Expansion)**
   - Poker-style claim wagering, calls, raises, parleys, and derivative hedging
   - Dual algorithmic and jury settlement oracles

4. **Layer 3: Epistemic DAO (Future Concurrent Expansion)**
   - Anonymous ZK-SNARK reputation identity bridges
   - Empathy and bridging-weighted governance voting
   - Ecosystem development and truth registry stewardship

---

## Development & Testing Commands

```bash
# Frontend Unit Tests (Vitest)
cd frontend && npm run test

# Frontend Unified Production Build
cd frontend && npm run build

# Backend Unit Tests (Pytest)
uv run pytest tests/unit/
```
