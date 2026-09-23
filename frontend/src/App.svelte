<script>
  import Header from './components/Header.svelte';
  import MiniChart from './components/MiniChart.svelte';
  import ByomModal from './components/ByomModal.svelte';

  // --- Svelte 5 Runes State ---
  let isDarkMode = $state(true);
  let isByomModalOpen = $state(false);
  let isUncapped = $state(false);
  let remainingQueries = $state(15);
  let inputText = $state("");
  let isLoading = $state(false);
  let activeTabTitle = $state("Current Webpage / Document");

  // Metrics state (verifiable facts vs opinion / speculation)
  let metrics = $state({
    factsPct: 82.5,
    opinionPct: 17.5,
    falsehoodPct: 0.0,
    title: "Page Verifiable Facts vs. Opinion"
  });

  let messages = $state([
    {
      id: 1,
      role: "agent",
      text: "👋 Welcome to VeriFact AI (Svelte 5 Frame)! I am your agentic fact-checking assistant. Enter a claim, or use 1-Click Connect to bring your own agent without usage caps.",
      metrics: null
    }
  ]);

  // Check saved BYOM state on mount
  $effect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("byom_settings") || "{}");
      if (saved.one_click || (saved.api_key && saved.provider !== "default")) {
        isUncapped = true;
      }
    } catch (e) {
      // ignore
    }
  });

  async function sendMessage(textToSend) {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    inputText = "";
    isLoading = true;

    // Add user message
    messages = [
      ...messages,
      { id: Date.now(), role: "user", text, metrics: null }
    ];

    try {
      const byomSettings = JSON.parse(localStorage.getItem("byom_settings") || "{}");
      const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          user_id: "svelte5-web-user",
          byom: byomSettings
        })
      });

      const data = await res.json();

      if (data.remaining !== undefined) {
        remainingQueries = data.remaining;
        if (data.remaining === 999) isUncapped = true;
      }

      // Format response text & extract metrics if present
      let responseText = "";
      if (data.parts && data.parts.length > 0) {
        responseText = data.parts
          .map(p => (p.kind === "text" ? p.text : JSON.stringify(p.data || "")))
          .join("\n\n");
      } else {
        responseText = data.text || "(No reply returned)";
      }

      // Simulate or extract metrics from agent output
      const hasMars = text.toLowerCase().includes("mars");
      const hasSpeculation = text.toLowerCase().includes("think") || text.toLowerCase().includes("maybe") || text.toLowerCase().includes("opinion");

      let currentMetrics = {
        factsPct: hasMars ? 10.0 : hasSpeculation ? 40.0 : 88.0,
        opinionPct: hasMars ? 10.0 : hasSpeculation ? 60.0 : 12.0,
        falsehoodPct: hasMars ? 80.0 : 0.0,
        title: "Claim Fact vs. Speculation Breakdown"
      };

      // Update global metrics banner
      metrics = currentMetrics;

      messages = [
        ...messages,
        {
          id: Date.now() + 1,
          role: "agent",
          text: responseText,
          metrics: currentMetrics
        }
      ];
    } catch (e) {
      messages = [
        ...messages,
        {
          id: Date.now() + 1,
          role: "agent",
          text: `⚠️ Error verifying claim: ${e.message}`,
          metrics: null
        }
      ];
    } finally {
      isLoading = false;
    }
  }

  function handlePillClick(sample) {
    sendMessage(sample);
  }

  function handleByomConnected(info) {
    isUncapped = info.uncapped;
    messages = [
      ...messages,
      {
        id: Date.now(),
        role: "agent",
        text: `⚡ Successfully connected ${info.provider}! Your fact-checking usage is now uncapped.`
      }
    ];
  }
</script>

<main class="extension-frame {isDarkMode ? 'dark-theme' : 'light-theme'}">
  <Header 
    {isUncapped}
    {remainingQueries}
    {isDarkMode}
    onToggleTheme={() => isDarkMode = !isDarkMode}
    onOpenByom={() => isByomModalOpen = true}
  />

  <!-- Mini-Chart View: Verifiable Facts vs Opinion/Speculation -->
  <MiniChart 
    factsPct={metrics.factsPct}
    opinionPct={metrics.opinionPct}
    falsehoodPct={metrics.falsehoodPct}
    title={metrics.title}
  />

  <!-- Active Tab Scanning Bar -->
  <div class="active-tab-bar">
    <div class="tab-info">
      <span class="material-symbols-outlined tab-icon">tab</span>
      <span class="tab-title" title={activeTabTitle}>{activeTabTitle}</span>
    </div>
    <button class="btn-scan" onclick={() => sendMessage("Analyze and fact-check the active webpage")}>
      <span class="material-symbols-outlined">radar</span>
      Scan Page
    </button>
  </div>

  <!-- Messages Chat Area -->
  <div class="chat-viewport">
    {#each messages as msg (msg.id)}
      <div class="chat-bubble-wrap {msg.role}">
        <div class="chat-bubble {msg.role}">
          <div class="msg-content">{msg.text}</div>
          {#if msg.metrics}
            <div class="msg-mini-chart">
              <MiniChart 
                factsPct={msg.metrics.factsPct}
                opinionPct={msg.metrics.opinionPct}
                falsehoodPct={msg.metrics.falsehoodPct}
                title="Claim Verifiable Metrics"
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

  .active-tab-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.4rem 0.65rem;
    background: rgba(0, 245, 212, 0.04);
    border-bottom: 1px solid var(--border);
  }

  .tab-info {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    overflow: hidden;
    max-width: 65%;
  }

  .tab-icon {
    font-size: 0.85rem;
    color: #00f5d4;
  }

  .tab-title {
    font-size: 0.72rem;
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .btn-scan {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background: rgba(0, 245, 212, 0.12);
    border: 1px solid #00f5d4;
    border-radius: 6px;
    color: #00f5d4;
    font-size: 0.68rem;
    font-weight: 600;
    padding: 0.2rem 0.45rem;
    cursor: pointer;
  }

  .btn-scan span {
    font-size: 0.85rem;
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
    max-width: 88%;
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

  .msg-mini-chart {
    margin-top: 0.5rem;
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
</style>
