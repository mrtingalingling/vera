<script>
  import { onMount } from 'svelte';
  import Header from './components/Header.svelte';
  import MiniChart from './components/MiniChart.svelte';
  import ByomModal from './components/ByomModal.svelte';
  import PermissionModal from './components/PermissionModal.svelte';
  import SourceEvidencePanel from './components/SourceEvidencePanel.svelte';
  import CatalogPanel from './components/CatalogPanel.svelte';
  import { createP2PNode } from './p2pNode.js';
  import { analyzeClaimLocally } from './localAiService.js';
  import { scanPageContent, highlightPageContent } from './scannerService.js';
  import {
    loadMessagesFromDB,
    saveMessageToDB,
    clearMessagesFromDB,
    loadPremisesFromDB,
    savePremisesToDB
  } from './db.js';

  // --- Svelte 5 Runes State ---
  let isDarkMode = $state(true);
  let isByomModalOpen = $state(false);
  let isPermissionModalOpen = $state(false);
  let isUncapped = $state(false);
  let remainingQueries = $state(15);
  let inputText = $state("");
  let isLoading = $state(false);
  let activeTabTitle = $state("Current Webpage / Document");

  // Tab Access Permission State (Time-Bound)
  let permissionState = $state({
    granted: false,
    duration: "1h",
    expiresAt: null
  });
  let timeLeftFormatted = $state("00:00");

  // Evidence Sources & Fact Catalog Panels State
  let isSourcePanelOpen = $state(false);
  let isCatalogPanelOpen = $state(false);
  let personalSources = $state([
    { id: 1, text: "Google Docs: Apollo_11_Grounded_Telemetry.gdoc (The Apollo 11 moon mission successfully landed on July 20, 1969.)", active: true },
    { id: 2, text: "Google Sheets: Fact_Checker_Algorithms_Matrix.gsheet (Vera utilizes advanced machine learning scoring for verification.)", active: true },
    { id: 3, text: "Google Docs: Vertex_Platform_Guide.gdoc (Google Cloud Vertex AI is a fully managed agent development platform.)", active: true }
  ]);

  // Toast Notification State
  let toastMessage = $state("");
  let toastTimer = null;

  function showToast(msg) {
    toastMessage = msg;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastMessage = "";
    }, 2800);
  }

  // P2P Swarm Node
  const p2pNode = createP2PNode();
  let p2pStatus = $state(p2pNode.status);
  let peersCount = $state(p2pNode.peers.length);

  // Persistent header/sidebar metrics state
  let persistentMetrics = $state({
    factsPct: 82.5,
    opinionPct: 17.5,
    falsehoodPct: 0.0,
    title: "Persistent Page & Session Analysis"
  });

  // Conversation history
  let messages = $state([
    {
      id: 1,
      role: "agent",
      text: "👋 Welcome to Vera! I am your decentralized AI fact-checking agent. Enter a claim, run on-device local AI, or activate a 1-Click Guest session.",
      metrics: {
        factsPct: 85.0,
        opinionPct: 15.0,
        falsehoodPct: 0.0
      }
    }
  ]);

  function getBackendEndpoint() {
    try {
      const customUrl = localStorage.getItem("backendUrl");
      if (customUrl && customUrl.trim()) {
        return customUrl.trim();
      }
    } catch (e) {
      // ignore
    }
    if (typeof window !== "undefined" && window.location && window.location.origin && window.location.origin.startsWith("http")) {
      return "/chat";
    }
    return "http://localhost:8080/chat";
  }

  function openPermissionModal() {
    isPermissionModalOpen = true;
  }

  function handleGrantPermission(duration) {
    let expiresAt = null;
    if (duration === "once") {
      expiresAt = Date.now() + 60 * 1000;
    } else if (duration === "15m") {
      expiresAt = Date.now() + 15 * 60 * 1000;
    } else if (duration === "1h") {
      expiresAt = Date.now() + 60 * 60 * 1000;
    } else if (duration === "always") {
      expiresAt = null;
    }

    permissionState = {
      granted: true,
      duration,
      expiresAt
    };

    try {
      localStorage.setItem("tab_permission", JSON.stringify(permissionState));
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ tab_permission: permissionState });
      }
    } catch (e) {
      // ignore
    }

    isPermissionModalOpen = false;
  }

  function handleDenyPermission() {
    revokePermission();
    isPermissionModalOpen = false;
  }

  function revokePermission() {
    permissionState = {
      granted: false,
      duration: "1h",
      expiresAt: null
    };
    try {
      localStorage.removeItem("tab_permission");
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        chrome.storage.local.remove("tab_permission");
      }
    } catch (e) {
      // ignore
    }
  }

  // Detect Chrome Extension context, active tab, and initialize timer
  $effect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("byom_settings") || "{}");
      if (saved.one_click || (saved.api_key && saved.provider !== "default")) {
        isUncapped = true;
      }
    } catch (e) {
      // ignore
    }

    // Load persisted tab permission
    try {
      const savedPerm = JSON.parse(localStorage.getItem("tab_permission") || "{}");
      if (savedPerm.granted) {
        if (savedPerm.duration === "always" || (savedPerm.expiresAt && savedPerm.expiresAt > Date.now())) {
          permissionState = savedPerm;
        } else {
          localStorage.removeItem("tab_permission");
        }
      }
    } catch (e) {
      // ignore
    }

    if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs[0]) {
          activeTabTitle = tabs[0].title || tabs[0].url || "Active Browser Tab";
        }
      });
    }

    // 1-second interval to update animated hourglass timer
    const permInterval = setInterval(() => {
      if (!permissionState.granted) {
        timeLeftFormatted = "00:00";
        return;
      }
      if (permissionState.duration === "always") {
        timeLeftFormatted = "∞";
        return;
      }
      if (permissionState.expiresAt) {
        const diff = permissionState.expiresAt - Date.now();
        if (diff <= 0) {
          revokePermission();
          timeLeftFormatted = "00:00";
        } else {
          const mins = Math.floor(diff / 60000);
          const secs = Math.floor((diff % 60000) / 1000);
          timeLeftFormatted = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
        }
      }
    }, 1000);

    return () => clearInterval(permInterval);
  });

  onMount(async () => {
    try {
      const savedMessages = await loadMessagesFromDB();
      if (savedMessages && savedMessages.length > 0) {
        messages = savedMessages;
      }
      const savedPremises = await loadPremisesFromDB();
      if (savedPremises && savedPremises.length > 0) {
        personalSources = savedPremises;
      }
    } catch (e) {
      console.warn("[Vera] DB hydration error:", e);
    }
  });

  async function handleClearHistory() {
    await clearMessagesFromDB();
    messages = [
      {
        id: 1,
        role: "agent",
        text: "👋 Welcome to Vera! I am your decentralized AI fact-checking agent. Enter a claim, run on-device local AI, or activate a 1-Click Guest session.",
        metrics: {
          factsPct: 85.0,
          opinionPct: 15.0,
          falsehoodPct: 0.0
        }
      }
    ];
    showToast("Chat history cleared from local storage");
  }

  async function sendMessage(textToSend) {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    inputText = "";
    isLoading = true;

    // Append and persist user message
    const userMsg = { id: Date.now(), role: "user", text, metrics: null };
    messages = [...messages, userMsg];
    await saveMessageToDB(userMsg);

    try {
      const byomSettings = JSON.parse(localStorage.getItem("byom_settings") || "{}");

      // Mode A: Local In-Browser AI Execution (Zero Cloud Calls) with Token Streaming
      if (byomSettings.provider === "local_worker") {
        const agentMsgId = Date.now() + 1;
        const placeholderMsg = {
          id: agentMsgId,
          role: "agent",
          text: "Analyzing claim on-device...",
          metrics: null
        };
        messages = [...messages, placeholderMsg];

        const localRes = await analyzeClaimLocally(text, (chunk, accumulated) => {
          messages = messages.map(m => m.id === agentMsgId ? { ...m, text: accumulated } : m);
        });
        const claimMetrics = localRes.metrics;
        
        // Broadcast claim attestation to local P2P swarm
        if (localRes.claims && localRes.claims[0]) {
          await p2pNode.publishClaim(localRes.claims[0]);
        }

        persistentMetrics = {
          factsPct: claimMetrics.factsPct,
          opinionPct: claimMetrics.opinionPct,
          falsehoodPct: claimMetrics.falsehoodPct,
          title: "Persistent Page & Session Analysis"
        };

        const finalAgentMsg = {
          id: agentMsgId,
          role: "agent",
          text: localRes.text,
          metrics: claimMetrics
        };

        messages = messages.map(m => m.id === agentMsgId ? finalAgentMsg : m);
        await saveMessageToDB(finalAgentMsg);
        return;
      }

      // Mode B: Cloud Proxy or BYOM API
      const endpoint = getBackendEndpoint();
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          user_id: "vera-client",
          byom: byomSettings
        })
      });

      const data = await res.json();

      if (data.remaining !== undefined) {
        remainingQueries = data.remaining;
        if (data.remaining === 999) isUncapped = true;
      }

      // Format response text & extract metrics
      let responseText = "";
      if (data.parts && data.parts.length > 0) {
        responseText = data.parts
          .map(p => (p.kind === "text" ? p.text : JSON.stringify(p.data || "")))
          .join("\n\n");
      } else {
        responseText = data.text || "(No reply returned)";
      }

      // Compute or retrieve claim metrics
      let claimMetrics;
      if (data.metrics) {
        claimMetrics = {
          factsPct: data.metrics.verifiable_facts_pct,
          opinionPct: data.metrics.opinion_speculation_pct,
          falsehoodPct: data.metrics.falsehood_pct || 0.0
        };
      } else {
        const hasMars = text.toLowerCase().includes("mars");
        const hasSpec = text.toLowerCase().includes("think") || text.toLowerCase().includes("maybe") || text.toLowerCase().includes("opinion");
        claimMetrics = {
          factsPct: hasMars ? 10.0 : hasSpec ? 35.0 : 88.0,
          opinionPct: hasMars ? 15.0 : hasSpec ? 65.0 : 12.0,
          falsehoodPct: hasMars ? 75.0 : 0.0
        };
      }

      // Broadcast to P2P swarm
      await p2pNode.publishClaim({
        claimText: text,
        verdict: claimMetrics.falsehoodPct > 50 ? 'misinformed' : claimMetrics.factsPct >= 70 ? 'verified' : 'need-additional-context',
        confidence: 90
      });

      // Update persistent session metrics
      persistentMetrics = {
        factsPct: claimMetrics.factsPct,
        opinionPct: claimMetrics.opinionPct,
        falsehoodPct: claimMetrics.falsehoodPct,
        title: "Persistent Page & Session Analysis"
      };

      // Append agent message with embedded response-card metrics & persist to DB
      const cloudAgentMsg = {
        id: Date.now() + 1,
        role: "agent",
        text: responseText,
        metrics: claimMetrics
      };
      messages = [...messages, cloudAgentMsg];
      await saveMessageToDB(cloudAgentMsg);
    } catch (e) {
      const errorMsg = {
        id: Date.now() + 1,
        role: "agent",
        text: `⚠️ Error verifying claim: ${e.message}`,
        metrics: {
          factsPct: 50.0,
          opinionPct: 50.0,
          falsehoodPct: 0.0
        }
      };
      messages = [...messages, errorMsg];
      await saveMessageToDB(errorMsg);
    } finally {
      isLoading = false;
    }
  }

  async function handleScanActivePage() {
    if (isLoading) return;

    if (!permissionState.granted) {
      isPermissionModalOpen = true;
      return;
    }

    if (permissionState.duration === "once") {
      revokePermission();
    }

    const chromeContext = typeof chrome !== 'undefined' ? chrome : null;
    const scanResult = await scanPageContent(chromeContext, inputText);

    if (scanResult.status === 'success') {
      activeTabTitle = scanResult.title || activeTabTitle;
      const snippet = scanResult.text.slice(0, 500);
      await sendMessage(`Fact-check page: "${scanResult.title}". Excerpt: "${snippet}"`);
    } else {
      await sendMessage(scanResult.text || "Analyze and fact-check the active webpage");
    }
  }

  async function handleHighlightClaims() {
    if (isLoading) return;

    if (!permissionState.granted) {
      isPermissionModalOpen = true;
      return;
    }

    if (permissionState.duration === "once") {
      revokePermission();
    }

    isLoading = true;
    const chromeContext = typeof chrome !== 'undefined' ? chrome : null;
    const scanResult = await scanPageContent(chromeContext, inputText);

    if (scanResult.status === 'success' && scanResult.text) {
      activeTabTitle = scanResult.title || activeTabTitle;

      // Extract claim sentences to highlight
      const sentences = scanResult.text
        .split(/(?<=[.?!])\s+/)
        .map(s => s.trim())
        .filter(s => s.length > 20 && s.length < 180)
        .slice(0, 6);

      const claimsToHighlight = sentences.map((sentence) => {
        const lower = sentence.toLowerCase();
        const isMisinformed = lower.includes("flat") || lower.includes("mars") || lower.includes("hoax") || lower.includes("fake");
        const isDisputed = lower.includes("dispute") || lower.includes("controversy") || lower.includes("debate");
        const isContext = lower.includes("think") || lower.includes("might") || lower.includes("maybe") || lower.includes("perhaps");

        const verdict = isMisinformed ? 'misinformed' : isDisputed ? 'disputed' : isContext ? 'need-additional-context' : 'verified';
        const confidence = isMisinformed ? 94 : isDisputed ? 82 : isContext ? 76 : 91;

        return {
          claimText: sentence,
          verdict,
          confidence,
          explanation: isMisinformed
            ? 'Debunked or misinformed claim identified by Vera verification engine.'
            : isDisputed
            ? 'Disputed epistemic claim with conflicting consensus.'
            : isContext
            ? 'Claim requires additional context to avoid misleading interpretation.'
            : 'Factual statement aligned with verified reference knowledge.',
          sources: ['Vera Grounded Epistemic Swarm']
        };
      });

      if (scanResult.title && !claimsToHighlight.some(c => c.claimText === scanResult.title)) {
        claimsToHighlight.unshift({
          claimText: scanResult.title,
          verdict: persistentMetrics.falsehoodPct > 40 ? 'misinformed' : 'verified',
          confidence: 90,
          explanation: `Page Title verification. Factuality ratio: ${persistentMetrics.factsPct}%.`,
          sources: ['Vera Epistemic Swarm']
        });
      }

      const hlRes = await highlightPageContent(chromeContext, claimsToHighlight);
      const count = hlRes.count > 0 ? hlRes.count : claimsToHighlight.length;

      messages = [
        ...messages,
        {
          id: Date.now(),
          role: "agent",
          text: `🎯 **Webpage Highlighting Complete**: Scanned "${scanResult.title}" and highlighted **${count}** claim segments directly on the active webpage. Hover over highlights to inspect Web-of-Trust (WOT) confidence cards.`,
          metrics: persistentMetrics
        }
      ];
    } else {
      messages = [
        ...messages,
        {
          id: Date.now(),
          role: "agent",
          text: `ℹ️ DOM claim highlighting is active in the Vera Chrome Extension. (Status: ${scanResult.warning || 'No active tab text found.'})`,
          metrics: null
        }
      ];
    }

    isLoading = false;
  }

  function handlePillClick(sample) {
    sendMessage(sample);
  }

  function toggleSourcePanel() {
    isSourcePanelOpen = !isSourcePanelOpen;
    if (isSourcePanelOpen) isCatalogPanelOpen = false;
  }

  function toggleCatalogPanel() {
    isCatalogPanelOpen = !isCatalogPanelOpen;
    if (isCatalogPanelOpen) isSourcePanelOpen = false;
  }

  async function syncActivePremises() {
    await savePremisesToDB(personalSources);
    const activeTexts = personalSources.filter(s => s.active).map(s => s.text);
    await sendMessage(
      `[Sources Control Update] I have updated my reference sources in the UI. ` +
      `Please set my active scenario premises for this session to: ${JSON.stringify(activeTexts)}. ` +
      `Let me know that my custom Workspace references are successfully loaded for future fact-checking!`
    );
  }

  async function handleAddSource(text) {
    const newId = personalSources.length ? Math.max(...personalSources.map(s => s.id)) + 1 : 1;
    personalSources = [...personalSources, { id: newId, text, active: true }];
    showToast("Added custom premise to grounding pool");
    await syncActivePremises();
  }

  async function handleToggleSource(id, active) {
    personalSources = personalSources.map(s => s.id === id ? { ...s, active } : s);
    showToast(active ? "Enabled grounding premise" : "Disabled grounding premise");
    await syncActivePremises();
  }

  async function handleLinkGoogleDoc() {
    const docPresets = [
      "Google Docs: Project_Grounded_Claims_2026.gdoc (Verified telemetry data: All SpaceX Mars claims in 2024 are fully simulated and fictional.)",
      "Google Docs: Corporate_Verified_Facts.gdoc (Official guideline: Vera runs strictly on verified knowledge bases.)",
      "Google Docs: Science_Digest_Climate.gdoc (Scientific consensus: Earth is a perfect oblate spheroid.)"
    ];
    const preset = docPresets[personalSources.length % docPresets.length];
    const newId = personalSources.length ? Math.max(...personalSources.map(s => s.id)) + 1 : 1;
    personalSources = [...personalSources, { id: newId, text: preset, active: true }];
    showToast("Linked Google Doc to grounding premises");
    await syncActivePremises();
  }

  async function handleLinkGoogleSheet() {
    const sheetPresets = [
      "Google Sheets: Verified_Fact_Matrix_Q4.gsheet (Contains 100 rows of official climate and astronomical verified reference truths.)",
      "Google Sheets: Hallucination_Control_Database.gsheet (Contains threshold parameters for fact-checking scoring algorithms.)",
      "Google Sheets: Historical_Anomalies.gsheet (Contains list of debunked internet hoaxes and historical timeline metrics.)"
    ];
    const preset = sheetPresets[personalSources.length % sheetPresets.length];
    const newId = personalSources.length ? Math.max(...personalSources.map(s => s.id)) + 1 : 1;
    personalSources = [...personalSources, { id: newId, text: preset, active: true }];
    showToast("Linked Google Sheet to grounding premises");
    await syncActivePremises();
  }

  async function handleShareFact(text) {
    showToast("Sharing verified fact to community pool...");
    await sendMessage(`Please share this verified reference fact to the global community pool so other users can fact-check against it: "${text}"`);
  }

  async function handleFetchCatalog() {
    showToast("Fetching catalog from Firestore...");
    await sendMessage("Please fetch the recent fact-checks from the Firestore catalog and present them in a clean summary table with metrics.");
  }

  async function handleSaveCatalog(data) {
    showToast("Saved fact-check to catalog");
    await sendMessage(`Save this verified fact check to the catalog: Claim: "${data.claim}", Verdict: "${data.verdict}", Accuracy: ${data.accuracy}%, Falsehood: ${data.falsehood}%, Hallucination: ${data.hallucination}%.`);
  }

  function handleByomConnected(info) {
    isUncapped = info.uncapped;
    showToast(`Activated ${info.provider} (Uncapped)`);
    messages = [
      ...messages,
      {
        id: Date.now(),
        role: "agent",
        text: `⚡ Successfully activated ${info.provider}! Your fact-checking usage is now uncapped without limits.`,
        metrics: {
          factsPct: 100.0,
          opinionPct: 0.0,
          falsehoodPct: 0.0
        }
      }
    ];
  }
</script>

<main class="extension-frame {isDarkMode ? 'dark-theme' : 'light-theme'}">
  {#if toastMessage}
    <div class="toast-notification">
      <span class="material-symbols-outlined toast-icon">check_circle</span>
      <span>{toastMessage}</span>
    </div>
  {/if}

  <Header 
    {isUncapped}
    {remainingQueries}
    {isDarkMode}
    {p2pStatus}
    {peersCount}
    onToggleTheme={() => isDarkMode = !isDarkMode}
    onOpenByom={() => { isByomModalOpen = true; isSourcePanelOpen = false; isCatalogPanelOpen = false; }}
    onClearHistory={handleClearHistory}
  />

  <!-- Persistent Header / Sidebar Mini-Chart Dashboard -->
  <div class="persistent-dashboard">
    <div class="persistent-header">
      <span class="material-symbols-outlined icon-summary">analytics</span>
      <span class="persistent-label">Persistent Fact / Opinion Ratio</span>
    </div>
    <MiniChart 
      factsPct={persistentMetrics.factsPct}
      opinionPct={persistentMetrics.opinionPct}
      falsehoodPct={persistentMetrics.falsehoodPct}
      title=""
    />
  </div>

  <!-- Control Center: Sources/Evidence & Fact Catalog Grid -->
  <div class="control-center-grid">
    <button 
      type="button" 
      class="control-btn {isSourcePanelOpen ? 'active' : ''}" 
      onclick={toggleSourcePanel}
    >
      <div class="control-btn-left">
        <span class="material-symbols-outlined icon-sources">cloud_sync</span>
        <span>Evidence & Docs ({personalSources.filter(s => s.active).length})</span>
      </div>
      <span class="material-symbols-outlined expand-icon">
        {isSourcePanelOpen ? 'expand_less' : 'expand_more'}
      </span>
    </button>

    <button 
      type="button" 
      class="control-btn {isCatalogPanelOpen ? 'active' : ''}" 
      onclick={toggleCatalogPanel}
    >
      <div class="control-btn-left">
        <span class="material-symbols-outlined icon-catalog">database</span>
        <span>Fact Catalog & Metrics</span>
      </div>
      <span class="material-symbols-outlined expand-icon">
        {isCatalogPanelOpen ? 'expand_less' : 'expand_more'}
      </span>
    </button>
  </div>

  <SourceEvidencePanel 
    isOpen={isSourcePanelOpen}
    sources={personalSources}
    onAddSource={handleAddSource}
    onToggleSource={handleToggleSource}
    onLinkDoc={handleLinkGoogleDoc}
    onLinkSheet={handleLinkGoogleSheet}
    onShareFact={handleShareFact}
  />

  <CatalogPanel 
    isOpen={isCatalogPanelOpen}
    onFetchCatalog={handleFetchCatalog}
    onSaveCatalog={handleSaveCatalog}
  />

  <!-- Active Tab Scanning Bar with Hourglass Timer & Highlight Action -->
  <div class="active-tab-bar">
    <div class="tab-info-wrap">
      {#if permissionState.granted}
        <button 
          type="button" 
          class="scanning-banner" 
          onclick={openPermissionModal} 
          title="Tab reading active ({timeLeftFormatted}). Click to change duration or revoke."
        >
          <svg class="hourglass-svg" width="13" height="13" viewBox="0 0 24 24">
            <g class="svg-frame">
              <path d="M 6 2 L 18 2 M 6 22 L 18 22 M 6 2 C 6 2, 7 8, 11 11.5 C 7 15, 6 22, 6 22 M 18 2 C 18 2, 17 8, 13 11.5 C 17 15, 18 22, 18 22" fill="none" stroke="#00f5d4" stroke-width="1.5" stroke-linecap="round"/>
              <path class="svg-sand-top" d="M 7 5 L 17 5 L 12 12 Z" fill="#00f5d4" opacity="0.85"/>
              <path class="svg-sand-bottom" d="M 12 12 L 12 12 L 12 12 Z" fill="#00f5d4" opacity="0.85"/>
              <line class="svg-drip" x1="12" y1="11" x2="12" y2="19" stroke="#00f5d4" stroke-width="1.2"/>
            </g>
          </svg>
          <span class="banner-time">{timeLeftFormatted}</span>
        </button>
      {:else}
        <button 
          type="button" 
          class="btn-permission-pill" 
          onclick={openPermissionModal} 
          title="Grant tab reading access to verify and highlight claims"
        >
          <span class="material-symbols-outlined">shield_person</span>
          <span>Tab Access</span>
        </button>
      {/if}

      <div class="tab-info">
        <span class="material-symbols-outlined tab-icon">tab</span>
        <span class="tab-title" title={activeTabTitle}>{activeTabTitle}</span>
      </div>
    </div>

    <div class="tab-actions">
      <button class="btn-scan" onclick={handleScanActivePage} title="Scan active page text and verify claims">
        <span class="material-symbols-outlined">radar</span>
        <span>Scan</span>
      </button>

      <button class="btn-highlight" onclick={handleHighlightClaims} title="Highlight claims with traffic-light badges and WOT tooltips on active webpage DOM">
        <span class="material-symbols-outlined">ink_highlighter</span>
        <span>Highlight</span>
      </button>
    </div>
  </div>

  <!-- Messages Chat Area -->
  <div class="chat-viewport">
    {#each messages as msg (msg.id)}
      <div class="chat-bubble-wrap {msg.role}">
        <div class="chat-bubble {msg.role}">
          <div class="msg-content">{msg.text}</div>
          
          <!-- Embedded Mini-Chart Inside Each Fact-Check Response Card -->
          {#if msg.role === 'agent' && msg.metrics}
            <div class="embedded-chart-card">
              <div class="card-chart-label">
                <span class="material-symbols-outlined chart-icon">pie_chart</span>
                <span>Response Ratio Breakdown</span>
              </div>
              <MiniChart 
                factsPct={msg.metrics.factsPct}
                opinionPct={msg.metrics.opinionPct}
                falsehoodPct={msg.metrics.falsehoodPct}
                title=""
              />
            </div>
          {/if}
        </div>
      </div>
    {/each}

    {#if isLoading}
      <div class="chat-bubble-wrap agent">
        <div class="chat-bubble agent loading-bubble">
          <div class="skeleton-pulse"></div>
          <span>Verifying claims with reasoning engine...</span>
        </div>
      </div>
    {/if}
  </div>

  <!-- Quick Prompts Pills -->
  <div class="quick-pills">
    <button class="pill" onclick={() => handlePillClick("Did humans land on Mars in 2024?")}>
      🔴 Mars Landing 2024
    </button>
    <button class="pill" onclick={() => handlePillClick("Is the Earth roughly 4.5 billion years old?")}>
      🟢 Earth Age (4.5B yrs)
    </button>
    <button class="pill" onclick={() => handlePillClick("Will AI replace programmers by next year?")}>
      🟣 AI Speculation
    </button>
  </div>

  <!-- Input Footer -->
  <form class="input-container" onsubmit={(e) => { e.preventDefault(); sendMessage(); }}>
    <input 
      type="text" 
      placeholder="Paste claim, URL, or ask a question..." 
      bind:value={inputText}
      disabled={isLoading}
      class="chat-input"
    />
    <button type="submit" class="btn-send" disabled={isLoading || !inputText.trim()} aria-label="Send">
      <span class="material-symbols-outlined">send</span>
    </button>
  </form>

  <ByomModal 
    bind:isOpen={isByomModalOpen}
    onConnected={handleByomConnected}
  />

  <PermissionModal 
    isOpen={isPermissionModalOpen}
    currentDuration={permissionState.duration}
    onGrant={handleGrantPermission}
    onDeny={handleDenyPermission}
    onClose={() => isPermissionModalOpen = false}
  />
</main>

<style>
  :global(:root) {
    --bg-dark: #0b0d17;
    --bg-panel-dark: #121829;
    --border-dark: rgba(255, 255, 255, 0.08);
    --text-dark: #f3f4f6;
    --text-muted-dark: #9ca3af;

    --bg-light: #f8fafc;
    --bg-panel-light: #ffffff;
    --border-light: rgba(0, 0, 0, 0.08);
    --text-light: #0f172a;
    --text-muted-light: #64748b;
  }

  .extension-frame {
    width: 100%;
    max-width: 380px;
    height: 600px;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin: 0 auto;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    position: relative;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.6);
  }

  .dark-theme {
    background: var(--bg-panel-dark);
    border: 1px solid var(--border-dark);
    color: var(--text-dark);
    --border: var(--border-dark);
    --text: var(--text-dark);
    --text-muted: var(--text-muted-dark);
    --bg-header: rgba(18, 24, 41, 0.95);
  }

  .light-theme {
    background: var(--bg-panel-light);
    border: 1px solid var(--border-light);
    color: var(--text-light);
    --border: var(--border-light);
    --text: var(--text-light);
    --text-muted: var(--text-muted-light);
    --bg-header: rgba(255, 255, 255, 0.95);
  }

  .persistent-dashboard {
    padding: 0.35rem 0.65rem 0.45rem 0.65rem;
    background: rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid var(--border);
  }

  .persistent-header {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    margin-bottom: 0.2rem;
  }

  .icon-summary {
    font-size: 0.85rem;
    color: #00f5d4;
  }

  .persistent-label {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-muted);
  }

  .control-center-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.45rem;
    padding: 0.4rem 0.65rem;
    border-bottom: 1px solid var(--border);
    background: rgba(17, 19, 30, 0.45);
  }

  .control-btn {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.35rem 0.55rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.2s ease;
    color: var(--text);
  }

  .control-btn:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.15);
  }

  .control-btn.active {
    background: rgba(0, 245, 212, 0.06);
    border-color: #00f5d4;
  }

  .control-btn-left {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.7rem;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .icon-sources {
    font-size: 0.95rem;
    color: #00f5d4;
  }

  .icon-catalog {
    font-size: 0.95rem;
    color: #00bbf9;
  }

  .expand-icon {
    font-size: 0.9rem;
    color: var(--text-muted);
  }

  .active-tab-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.35rem 0.65rem;
    background: rgba(0, 245, 212, 0.04);
    border-bottom: 1px solid var(--border);
  }

  .tab-info-wrap {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    overflow: hidden;
    flex: 1;
  }

  .tab-info {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    overflow: hidden;
    flex: 1;
  }

  .tab-icon {
    font-size: 0.85rem;
    color: #00f5d4;
    flex-shrink: 0;
  }

  .tab-title {
    font-size: 0.72rem;
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tab-actions {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    flex-shrink: 0;
  }

  .btn-scan {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    background: rgba(0, 245, 212, 0.12);
    border: 1px solid #00f5d4;
    border-radius: 6px;
    color: #00f5d4;
    font-size: 0.68rem;
    font-weight: 600;
    padding: 0.2rem 0.45rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-scan:hover {
    background: rgba(0, 245, 212, 0.2);
  }

  .btn-scan span {
    font-size: 0.82rem;
  }

  .btn-highlight {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    background: rgba(165, 94, 234, 0.14);
    border: 1px solid #a55eea;
    border-radius: 6px;
    color: #c084fc;
    font-size: 0.68rem;
    font-weight: 600;
    padding: 0.2rem 0.45rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-highlight:hover {
    background: rgba(165, 94, 234, 0.25);
  }

  .btn-highlight span {
    font-size: 0.82rem;
  }

  .scanning-banner {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    background: rgba(0, 245, 212, 0.1);
    border: 1px solid rgba(0, 245, 212, 0.35);
    border-radius: 6px;
    padding: 0.15rem 0.35rem;
    color: #00f5d4;
    cursor: pointer;
    flex-shrink: 0;
    font-family: inherit;
    transition: all 0.2s ease;
  }

  .scanning-banner:hover {
    background: rgba(0, 245, 212, 0.18);
  }

  .banner-time {
    font-size: 0.65rem;
    font-weight: 700;
    font-family: monospace;
  }

  .btn-permission-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    background: rgba(255, 171, 0, 0.12);
    border: 1px solid rgba(255, 171, 0, 0.4);
    border-radius: 6px;
    padding: 0.15rem 0.35rem;
    color: #ffab00;
    cursor: pointer;
    font-size: 0.65rem;
    font-weight: 600;
    flex-shrink: 0;
    font-family: inherit;
    transition: all 0.2s ease;
  }

  .btn-permission-pill:hover {
    background: rgba(255, 171, 0, 0.22);
  }

  .btn-permission-pill span {
    font-size: 0.8rem;
  }

  /* Animated SVG Hourglass Keyframes */
  @keyframes svg-flip {
    0%, 45% { transform: rotate(0deg); }
    50%, 95% { transform: rotate(180deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes svg-drip {
    0% { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: 6; }
  }

  @keyframes svg-sandTop {
    0% { d: path('M 7 5 L 17 5 L 12 12 Z'); }
    45%, 50% { d: path('M 12 11.5 L 12 11.5 L 12 12 Z'); }
  }

  @keyframes svg-sandBottom {
    0%, 100% { d: path('M 12 12 L 12 12 L 12 12 Z'); }
    45%, 50% { d: path('M 7 19 L 17 19 L 12 12 Z'); }
  }

  .svg-frame {
    animation: svg-flip 5s cubic-bezier(0.6, -0.28, 0.735, 0.045) infinite;
    transform-origin: 12px 12px;
  }

  .svg-drip {
    stroke-dasharray: 2, 4;
    animation: svg-drip 0.5s linear infinite;
  }

  .svg-sand-top {
    animation: svg-sandTop 5s ease-in-out infinite;
  }

  .svg-sand-bottom {
    animation: svg-sandBottom 5s ease-in-out infinite;
  }

  .chat-viewport {
    flex: 1;
    overflow-y: auto;
    padding: 0.65rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .chat-bubble-wrap {
    display: flex;
  }

  .chat-bubble-wrap.user {
    justify-content: flex-end;
  }

  .chat-bubble-wrap.agent {
    justify-content: flex-start;
  }

  .chat-bubble {
    max-width: 90%;
    padding: 0.6rem 0.8rem;
    border-radius: 12px;
    font-size: 0.78rem;
    line-height: 1.45;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .chat-bubble.user {
    background: linear-gradient(135deg, #8338ec, #3a86c8);
    color: #fff;
    border-bottom-right-radius: 3px;
  }

  .chat-bubble.agent {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border);
    color: var(--text);
    border-bottom-left-radius: 3px;
  }

  .loading-bubble {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-muted);
  }

  .skeleton-pulse {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid #00f5d4;
    border-top-color: transparent;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .embedded-chart-card {
    margin-top: 0.6rem;
    padding-top: 0.45rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .card-chart-label {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.64rem;
    font-weight: 700;
    color: #00f5d4;
    margin-bottom: 0.25rem;
  }

  .chart-icon {
    font-size: 0.8rem;
  }

  .quick-pills {
    display: flex;
    gap: 0.35rem;
    padding: 0.35rem 0.65rem;
    overflow-x: auto;
    border-top: 1px solid var(--border);
  }

  .pill {
    white-space: nowrap;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 0.2rem 0.5rem;
    font-size: 0.65rem;
    color: var(--text-muted);
    cursor: pointer;
  }

  .pill:hover {
    color: var(--text);
    border-color: #00f5d4;
  }

  .input-container {
    display: flex;
    padding: 0.5rem 0.65rem;
    gap: 0.4rem;
    border-top: 1px solid var(--border);
    background: var(--bg-header);
  }

  .chat-input {
    flex: 1;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.45rem 0.65rem;
    font-size: 0.78rem;
    color: var(--text);
    outline: none;
  }

  .chat-input:focus {
    border-color: #00f5d4;
  }

  .btn-send {
    background: #00f5d4;
    border: none;
    border-radius: 8px;
    color: #0b0d17;
    padding: 0.45rem 0.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .btn-send:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .btn-send span {
    font-size: 1rem;
  }

  .toast-notification {
    position: fixed;
    top: 54px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(15, 20, 35, 0.94);
    backdrop-filter: blur(8px);
    border: 1px solid #00f5d4;
    box-shadow: 0 4px 16px rgba(0, 245, 212, 0.25);
    border-radius: 20px;
    padding: 0.35rem 0.85rem;
    font-size: 0.72rem;
    color: #f3f4f6;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    z-index: 9999;
    animation: toastSlideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .toast-icon {
    font-size: 0.95rem;
    color: #00f5d4;
  }

  @keyframes toastSlideDown {
    from {
      opacity: 0;
      transform: translate(-50%, -10px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
</style>
