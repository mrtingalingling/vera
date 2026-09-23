# 🛡️ Vera · Decentralized AI Fact Verification & Epistemic Grounding

> A decentralized, agentic AI verification assistant designed to evaluate factual claims, ground browser consumption in real-time, and calculate empirical fact vs. opinion ratios across web applications and browser extensions.

<div align="center">
  <img src="./demo.gif" alt="Vera Chrome Extension Demo" width="375" style="border-radius: 12px; box-shadow: 0 8px 30px rgba(0, 245, 212, 0.2); border: 2px solid #00f5d4;" />
  <p><i>Vera running inside a unified Svelte 5 Chrome Extension Popup and standalone Web Cockpit, featuring active webpage scanning, 4-category DOM highlighting, and decentralized P2P swarm synchronization.</i></p>
</div>

---

## 📚 Product Documentation

All product-related documentation is consolidated in the [**`docs/`**](./docs/) directory:

* 📋 [**Master PRD (`docs/PRD.md`)**](./docs/PRD.md): Complete product requirements, architectural thesis (*Truth Settlement*), and 4-layer specification (Layer 0 Active Baseline through Layers 1–3).
* ⚙️ [**Features Specification (`docs/features.md`)**](./docs/features.md): Consolidated technical details of active features (Svelte 5 runes, local AI Web Worker, BYOM presets, 4-verdict DOM highlighting, dual mini-charts, P2P swarm) and future expansions.
* 🗺️ [**User Journeys (`docs/user_journeys.md`)**](./docs/user_journeys.md): Step-by-step user workflows for on-device checking, extension page scanning, frictionless 1-click uncap, P2P gossip, and courtroom deliberation.

---

## 🌟 Key Features (Layer 0 Baseline)

* **Fine-Grained Svelte 5 Runes**: Zero-VDOM reactive architecture built on `$state`, `$derived`, and `$effect`.
* **Unified Build Pipeline**: Single Vite build compiles synchronously into both `frontend/static/dist/` (web) and `extension/dist/` (Chrome extension).
* **Dual-Execution AI Engine**:
  * **Local In-Browser AI**: Zero-leakage client-side heuristic classification via Web Worker/WebGPU (`localAiService.js`).
  * **Cloud BYOM Reasoning**: 1-click frictionless Guest Agent preset (uncapped, zero credentials), Google OAuth, and custom API keys (Gemini, OpenAI, Anthropic, DeepSeek, Grok).
* **Real-time Active Tab Scanning & 4-Category DOM Highlighting**:
  * Scans page body text via `GET_PAGE_CONTENT`.
  * Highlights claims directly in the host DOM with 4 distinct badges:
    * 🟢 `verified` (Grounded factual baseline)
    * 🟠 `disputed` (Conflicting authorities)
    * 🔴 `misinformed` (Refuted claims / falsehoods)
    * 🟣 `need-additional-context` (Speculative statements / missing qualifiers)
  * Interactive Web of Trust (WOT) hover cards detailing verdicts and sources.
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
├── docs/                     # Consolidated Product Documentation (PRD, Features, Journeys)
├── app/                      # Main Agent Package (Vertex AI Reasoning Engine)
│   ├── agent.py              # Main Agent logic, Prompt & Tool registry
│   ├── a2ui_utils.py         # A2UI card renderer callback
│   └── app_utils/            # Modular Helper Tools (Firestore, RAG, Memory, Video)
├── frontend/                 # Svelte 5 Frontend & FastAPI Gateway
│   ├── src/                  # Svelte 5 Source Components (App, Header, MiniChart, ByomModal)
│   │   ├── localAiService.js # On-device zero-leakage local AI engine
│   │   ├── p2pNode.js        # libp2p P2P swarm node manager
│   │   └── scannerService.js # Bi-directional tab scanner & DOM highlighter
│   ├── static/               # Web distribution & standalone frame.html
│   ├── vite.config.js        # Unified build syncing to static/dist and extension/dist
│   └── main.py               # FastAPI backend proxy with BYOM routing & rate limits
├── extension/                # Manifest V3 Chrome Extension
│   ├── manifest.json         # Extension manifest
│   ├── content.js            # In-page DOM scanner, 4-verdict highlighter & WOT tooltips
│   ├── popup.html            # Extension popup mounting Svelte 5 cockpit
│   └── dist/                 # Compiled Svelte 5 bundle synchronized from frontend/
├── tests/                    # Unit & Integration Tests suite
├── pyproject.toml            # Astral uv package config
└── demo.gif                  # Extension demo recording
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

### 3. Build Frontend & Start Server
```bash
# Build unified Svelte 5 bundles (web + extension)
cd frontend
npm run build

# Start FastAPI server on port 8080
uv run python main.py
```
Open **`http://localhost:8080/`** or **`http://localhost:8080/frame.html`** in your browser!

---

## 🧩 Loading into Chrome Extension (Manifest V3)

1. Open Chrome and navigate to **`chrome://extensions/`**.
2. Toggle on **Developer mode** (top-right).
3. Click **"Load unpacked"** and select the **`extension/`** folder in this repository.
4. Click the **Vera** extension icon in your Chrome toolbar to open the cockpit.
5. Click **"Scan Page"** on any active webpage to extract and highlight claims in real-time.

---

## 🧪 Testing

```bash
# Run backend Python tests (19 unit tests)
uv run pytest tests/unit/

# Run frontend Vitest tests (9 unit tests)
cd frontend && npm run test
```
