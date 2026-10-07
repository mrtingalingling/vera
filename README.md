# Vera

Vera is a standalone AI agent that tells a reader whether a claim is supported by evidence, shows that evidence with a confidence, and says "insufficient evidence" when it can't tell. Any platform can embed it through a public API, SDK, and web components; the Chrome extension is its first client.

<div align="center">
  <img src="./demo.gif" alt="Vera Chrome extension demo" width="375" />
  <p><i>The current prototype: page scanning, claim highlighting, time-bound tab access, and Drive evidence grounding.</i></p>
</div>

## Key features

Every feature carries exactly one status: **Proposed → Confirmed → Prototyped → Audited**. Only Audited features are meant for outside users. Today nothing in this repo is Audited.

**In the prototype today (Prototyped)**

- **Web cockpit and Chrome extension:** one Svelte 5 build serves the web cockpit and the Manifest V3 extension.
- **Page scanning and claim highlighting:** claims on a page are highlighted by verdict, with hover cards showing sources and reasoning.
- **On-device privacy:** a local scrubber removes personal data before anything is sent, using Gemini Nano where available.
- **Bring your own model:** connect your own model provider; your key goes straight to the provider.
- **Time-bound tab access:** grant reading access to a tab for a limited time.
- **Your own evidence:** add Google Drive, Docs, and Sheets as sources.
- **Fact-versus-opinion charts:** gauges showing how much of a page is checkable fact versus opinion.

**Planned (Proposed in the design set)**

- **Verification pipeline:** a seven-stage pipeline with six verdicts, including an honest "insufficient evidence," each backed by linked sources and a confidence.
- **Public API, SDK, and web components:** any platform can embed Vera.
- **Hallucination checks:** anyone can ask Vera to re-verify a verdict's sources and context.
- **Graph views:** source-flow, money-flow, mind-map, quadrant, and fishbone diagrams for each verdict.
- **Personal relevance:** an optional, on-device profile that flags which claims matter to you, without changing any verdict.
- **Signed verdict ledger:** append-only verdicts published to ATProto, with corrections as new versions.
- **Vera for AI agents:** an MCP server and an A2A endpoint, so other AI agents can use Vera as an independent reviewer of their own output.
- **Free tier and assisted mode:** 15 free queries a month without an account; after that, upgrade, or switch to assisted mode, where Vera finds the evidence and your own model or ChatGPT-style plan judges it on your device.

Some prototype features are being removed on purpose: the canned guest agent, global fact sharing, video generation, and the "connected peers" display. The design set lists where every feature goes.

The server is moving from Python to Rust (ADR-014). The Python prototype gets only the fixes Gate 0 needs and is retired when the Phase 1 pipeline replaces it.

## Documentation

The design set is the source of truth for what Vera is and how it will be built:

- **Vera design set:** brief, pipeline, API, ADRs, implementation plan, tickets, and security plan — [`docs/vera.md`](./docs/vera.md)
- **Diagrams:** [`docs/images/vera-architecture.svg`](./docs/images/vera-architecture.svg), [`docs/images/vera-roadmap.svg`](./docs/images/vera-roadmap.svg)
- **Ecosystem overview and ClearCloud:** in ClearCloud's repo
- **Veracities.bet:** in the `veracities.social` repo

Older docs in `docs/` (the Truth Settlement PRD, Layer 0–3 architecture, and caveats ledger) are superseded by the design set and will be removed under ticket V-009.

## Getting started (Python prototype)

### 1. Install dependencies

```bash
# Python dependencies
agents-cli install

# Frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Set environment variables

Create a `.env` in the repo root. Use your own resource names; none belong in git (ticket V-006).

```bash
export AGENT_ENGINE_RESOURCE_NAME="projects/<project-id>/locations/<region>/reasoningEngines/<engine-id>"
export AGENT_DIRECTORY="app"
```

### 3. Build and run

```bash
# Build the web and extension bundles
npm run build

# Start the FastAPI server on port 8080
npm run serve
```

Then open `http://localhost:8080/` or `http://localhost:8080/frame.html`.

## Loading the Chrome extension

1. Open `chrome://extensions/`.
2. Turn on **Developer mode**.
3. Click **Load unpacked** and select the `extension/` folder.
4. Click the Vera icon in the toolbar to open the cockpit.
5. Click **Tab Access** to grant temporary reading access, then **Highlight** or **Scan** on any page.

The extension will move to a side panel with optional host permissions in Phase 3 (V-301, V-302).

## Testing

```bash
# Frontend and backend together
npm test

# Or separately
npm run test:frontend
npm run test:backend
```

Standalone CI for this repo is ticket V-010; until then, tests run locally.

## Repository structure

```text
vera/
├── docs/                 # Design set and diagrams
├── app/                  # Python agent prototype (retired after Phase 1)
│   ├── agent.py          # Agent logic and tool registry
│   └── app_utils/        # Firestore, RAG, and memory helpers
├── frontend/             # Svelte 5 cockpit and FastAPI gateway
│   ├── src/              # Cockpit components and client services
│   ├── vite.config.js    # One build for web and extension
│   └── main.py           # FastAPI proxy with BYOM routing and rate limits
├── extension/            # Manifest V3 Chrome extension
├── tests/                # Unit and integration tests
├── package.json          # Root scripts
└── pyproject.toml        # uv package config
```

## Related

- **Governance:** the EnDAOsment-based DAO contracts belong to ClearCloud and are moving to its repo (C-012).
- **Contributing:** AI-assigned tickets follow the reviewable-diffs skill in this repo, and every ticket has a reviewer other than its author.
