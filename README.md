# 🛡️ Vera · Decentralized AI Fact Verification & Epistemic Grounding

> A decentralized, agentic AI verification assistant designed to evaluate factual claims, ground browser consumption in real-time, and calculate empirical fact vs. opinion ratios across web applications and browser extensions.

<div align="center">
  <img src="./demo.gif" alt="Vera Chrome Extension Demo" width="375" style="border-radius: 12px; box-shadow: 0 8px 30px rgba(0, 245, 212, 0.2); border: 2px solid #00f5d4;" />
  <p><i>Vera running inside the unified Chrome Extension Popup and standalone Web Cockpit, featuring active webpage scanning, discrete DOM claim highlighting, time-bound tab permissions with live hourglass countdown, Google Drive evidence grounding, and decentralized P2P swarm synchronization.</i></p>
</div>

---

## 📚 Product Documentation

All product-related documentation is consolidated in the [**`docs/`**](./docs/) directory:

* 📋 [**Master PRD (`docs/PRD.md`)**](./docs/PRD.md): Complete product requirements, architectural thesis (*Truth Settlement*), and 4-layer specification (Layer 0 Active Baseline through Layers 1–3).
* ⚙️ [**Features Specification (`docs/features.md`)**](./docs/features.md): Consolidated technical details of active features (local AI Web Worker / Gemini Nano, BYOM presets, 4-verdict DOM highlighting, dual mini-charts, time-bound tab permissions, evidence grounding, and P2P swarm) and future expansions.
* 🗺️ [**User Journeys (`docs/user_journeys.md`)**](./docs/user_journeys.md): Step-by-step user workflows for on-device checking, time-bound page scanning & DOM highlighting, Google Drive evidence grounding, 1-click uncap, P2P gossip, and courtroom deliberation.

---

## 🌟 Key Features (Layer 0 Baseline)

* **Fine-Grained Reactive Cockpit**: Zero-VDOM fine-grained text rendering built on Svelte 5 runes (`$state`, `$derived`, `$effect`).
* **Unified Build Pipeline**: Single Vite build compiles synchronously into both `frontend/static/dist/` (web) and `extension/dist/` (Chrome extension).
* **Dual-Execution AI Engine**:
  * **Local In-Browser AI**: Zero-leakage client-side heuristic classification via Web Worker/WebGPU (`localAiService.js`) and direct integration with Chrome Built-In AI (Gemini Nano).
  * **Cloud BYOM Reasoning**: 1-click frictionless Guest Agent preset (uncapped, zero credentials), Google OAuth, custom remote backend URLs, and custom API keys (Gemini, OpenAI, Anthropic, DeepSeek, Grok).
* **Time-Bound Tab Permissions**:
  * Granular duration options (*Just once*, *15 Minutes*, *1 Hour*, *Always for domain*).
  * Live animated rotating SVG hourglass countdown banner (`Active: MM:SS` or `Active: ∞`) with instant revocation or duration adjustment.
* **Real-time Active Tab Scanning & 4-Category DOM Highlighting**:
  * **Scan Page**: Conversational fact-checking and multi-turn claim analysis in the Cockpit.
  * **Highlight Claims**: Directly injects 4-category color-coded `<mark>` tags into the webpage DOM:
    * 🟢 `verified` (Grounded factual baseline)
    * 🟠 `disputed` (Conflicting authorities)
    * 🔴 `misinformed` (Refuted claims / falsehoods)
    * 🟣 `need-additional-context` (Speculative statements / missing qualifiers)
  * Interactive Web of Trust (WOT) hover cards detailing verdicts, sources, and epistemic reasoning.
* **Evidence & Grounding Sources Control Center**:
  * Connect custom reference notes and URLs.
  * Direct 1-click integration with **Google Docs** and **Google Sheets**.
  * Dynamic premise toggle synchronization (`syncActivePremises`) updating agent context in real-time.
  * Verified fact sharing to the global community pool.
* **Fact Catalog & Database Metrics**:
  * Direct submission of fact-checks with 4-category verdicts and accuracy / falsehood / speculation percentages to Firestore.
  * Live querying and review of community fact-check history and truth metrics.
* **Persistent & Embedded Mini-Charts**: Real-time visual ratio gauges tracking verifiable facts vs. opinion/speculation across the session and within individual chat messages.
* **Decentralized libp2p Swarm Transport**: P2P claim attestation gossiping with deterministic claim digests (`p2pNode.js`).

---

## 🧠 Google Cloud Architecture & Tools

| Google Cloud Component | Role in Vera | Powered By |
|---|---|---|
| 🤖 **Reasoning Core** | Conversational reasoning & claim evaluation | **Gemini 2.5 Flash** |
| 🎬 **Omni Media Gen** | Direct video explanation generation | **gemini-omni-flash-preview** |
| 🗄️ **Structured Data** | Persisting and listing the global truth catalog | **Cloud Firestore** |
| 🖼️ **Media Registry** | Hosting generated video bytes | **Cloud Storage (GCS)** |
| 📖 **Grounded RAG** | Indexing guidelines and verified truth documents | **Vertex AI RAG Engine** |
| 🧪 **Secure Sandbox** | Compiling source credibility heuristic calculations | **Agent Engine Code Executor** |
| 🧠 **Persistent Context** | Retaining active scenarios and preferences across sessions | **Vertex AI Memory Bank** |
| 🪟 **Agent-First UI** | Rendering structured interactive detail cards | **A2UI Schema Manager (v0.8)** |
| 🌐 **A2A Proxy Gateway** | Orchestrating client-to-agent reasoning passes | **FastAPI + Cloud Run** |

---

## 📁 Repository Directory Structure

```text
vera/
├── docs/                             # Consolidated Product Documentation (PRD, Features, Journeys)
├── app/                              # Main Agent Package (Vertex AI Reasoning Engine)
│   ├── agent.py                      # Main Agent logic, Prompt & Tool registry
│   ├── a2ui_utils.py                 # A2UI card renderer callback
│   └── app_utils/                    # Modular Helper Tools (Firestore, RAG, Memory, Video)
├── frontend/                         # Frontend & FastAPI Gateway
│   ├── src/                          # Reactive Cockpit Components
│   │   ├── App.svelte                # Root Cockpit view & state orchestrator
│   │   ├── components/               # Modular UI Components
│   │   │   ├── Header.svelte         # Brand, theme, BYOM trigger, query limit pill
│   │   │   ├── MiniChart.svelte      # Facts vs. Opinion mini-chart visualizer
│   │   │   ├── ByomModal.svelte      # 1-click uncap, local AI, keys & remote backend URL
│   │   │   ├── PermissionModal.svelte # Time-bound tab access duration selector
│   │   │   ├── SourceEvidencePanel.svelte # Evidence grounding & Google Drive integration
│   │   │   └── CatalogPanel.svelte   # Fact catalog & truth database metrics drawer
│   │   ├── localAiService.js         # On-device zero-leakage local AI engine
│   │   ├── p2pNode.js                # libp2p P2P swarm node manager
│   │   └── scannerService.js         # Bi-directional tab scanner & DOM highlighter
│   ├── static/                       # Web distribution & standalone frame.html
│   ├── vite.config.js                # Unified build syncing to static/dist and extension/dist
│   └── main.py                       # FastAPI backend proxy with BYOM routing & rate limits
├── extension/                        # Manifest V3 Chrome Extension
│   ├── manifest.json                 # Extension manifest
│   ├── content.js                    # In-page DOM scanner, 4-verdict highlighter & WOT tooltips
│   ├── popup.html                    # Extension popup mounting Cockpit
│   └── dist/                         # Compiled bundle synchronized from frontend/
├── tests/                            # Unit & Integration Tests suite
├── package.json                      # Unified root DX runner scripts
├── pyproject.toml                    # Astral uv package config
└── demo.gif                          # Extension demo recording
```

---

## 🚀 Getting Started Locally

### 1. Install Dependencies
```bash
# Python dependencies
agents-cli install

# Frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Set Up Environment Variables
Create a `.env` in the root:
```bash
export AGENT_ENGINE_RESOURCE_NAME="projects/419816504777/locations/us-east1/reasoningEngines/6326484353106837504"
export AGENT_DIRECTORY="app"
```

### 3. Build & Run
Thanks to the unified root runner, you can build and run directly from the workspace root:
```bash
# Build unified bundles (web + extension)
npm run build

# Start FastAPI server on port 8080
npm run serve
```
Open **`http://localhost:8080/`** or **`http://localhost:8080/frame.html`** in your browser!

---

## 🧩 Loading into Chrome Extension (Manifest V3)

1. Open Chrome and navigate to **`chrome://extensions/`**.
2. Toggle on **Developer mode** (top-right).
3. Click **"Load unpacked"** and select the **`extension/`** folder in this repository.
4. Click the **Vera** extension icon in your Chrome toolbar to open the cockpit.
5. Click **"Tab Access"** to grant 15-minute or continuous reading access, then click **"Highlight"** or **"Scan"** to verify claims on any live webpage.

---

## 🧪 Testing

Run both frontend and backend suites simultaneously with one root command:
```bash
npm test
```
Or run individual suites:
```bash
# Backend Python tests (19 unit tests)
npm run test:backend

# Frontend Vitest tests (18 unit tests)
npm run test:frontend
```

