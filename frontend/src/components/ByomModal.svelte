<script>
  let { isOpen = $bindable(false), onConnected = () => {} } = $props();

  let provider = $state("in_app_agent");
  let apiKey = $state("");
  let modelName = $state("");
  let isUncapped = $state(false);

  const providerPortals = {
    gemini: "https://aistudio.google.com/app/apikey",
    openai: "https://platform.openai.com/api-keys",
    anthropic: "https://console.anthropic.com/settings/keys",
    grok: "https://console.x.ai/",
    custom: "https://openrouter.ai/keys"
  };

  function loadSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem("byom_settings") || "{}");
      if (saved.provider) provider = saved.provider;
      if (saved.api_key) apiKey = saved.api_key;
      if (saved.model) modelName = saved.model;
      isUncapped = !!(saved.one_click || (saved.api_key && saved.provider !== "default"));
    } catch (e) {
      // ignore
    }
  }

  function handleOneClickConnect() {
    const settings = {
      provider: "in_app_agent",
      one_click: true,
      model: "gemini-1.5-flash",
      api_key: "in_app_session_token"
    };
    localStorage.setItem("byom_settings", JSON.stringify(settings));
    isUncapped = true;
    isOpen = false;
    onConnected({ uncapped: true, provider: "1-Click Agent" });
  }

  function handleSaveKey() {
    const settings = {
      provider,
      api_key: apiKey.trim(),
      model: modelName.trim(),
      one_click: false
    };
    localStorage.setItem("byom_settings", JSON.stringify(settings));
    isUncapped = !!(settings.api_key && settings.provider !== "default");
    isOpen = false;
    onConnected({ uncapped: isUncapped, provider });
  }

  function handleClearKey() {
    localStorage.removeItem("byom_settings");
    apiKey = "";
    modelName = "";
    provider = "default";
    isUncapped = false;
    isOpen = false;
    onConnected({ uncapped: false, provider: "default" });
  }

  async function handlePasteClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) apiKey = text.trim();
    } catch (e) {
      alert("Please allow clipboard access or paste manually.");
    }
  }

  $effect(() => {
    if (isOpen) {
      loadSettings();
    }
  });
</script>

{#if isOpen}
  <div class="modal-backdrop" onclick={() => isOpen = false} role="presentation">
    <div class="modal-box" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
      <div class="modal-header">
        <div class="title-wrap">
          <span class="material-symbols-outlined icon-key">key</span>
          <h3>Bring Your Own Agent / AI Model</h3>
        </div>
        <button class="btn-close" onclick={() => isOpen = false} aria-label="Close">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- 1-Click Frictionless Connect for Non-Technical Users -->
      <div class="one-click-card">
        <button class="btn-one-click" onclick={handleOneClickConnect}>
          <span class="material-symbols-outlined">bolt</span>
          <span>1-Click Connect In-App Agent (No API Key Required)</span>
        </button>
        <p class="one-click-hint">
          Ideal for non-technical users. Automatically uncaps your daily fact-checking query limit with a single click.
        </p>
      </div>

      <div class="divider">
        <span>OR CONNECT CUSTOM REMOTE KEY</span>
      </div>

      <div class="form-body">
        <div class="form-row">
          <label for="provider-select">AI Provider</label>
          {#if providerPortals[provider]}
            <a href={providerPortals[provider]} target="_blank" rel="noopener noreferrer" class="portal-link">
              Get Key ↗
            </a>
          {/if}
        </div>
        <select id="provider-select" bind:value={provider} class="input-field">
          <option value="in_app_agent">Default / 1-Click In-App Agent</option>
          <option value="gemini">Google Gemini (Gemini 2.5 Flash / Pro)</option>
          <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
          <option value="anthropic">Anthropic (Claude 3.5 Sonnet / Opus)</option>
          <option value="grok">xAI Grok (Grok-2)</option>
          <option value="custom">Custom / OpenRouter</option>
        </select>

        <div class="form-row">
          <label for="api-key-input">Remote API Key</label>
          <button type="button" class="btn-paste" onclick={handlePasteClipboard}>
            Paste 📋
          </button>
        </div>
        <input 
          id="api-key-input"
          type="password" 
          placeholder="sk-..., AIza..., xai-..." 
          bind:value={apiKey}
          class="input-field"
        />

        <label for="model-name-input">Model Name (Optional)</label>
        <input 
          id="model-name-input"
          type="text" 
          placeholder="e.g. gpt-4o-mini, claude-3-5-sonnet" 
          bind:value={modelName}
          class="input-field"
        />

        <div class="btn-actions">
          <button class="btn-save" onclick={handleSaveKey}>
            Save Key & Connect
          </button>
          <button class="btn-clear" onclick={handleClearKey}>
            Clear Key
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
  }

  .modal-box {
    width: 90%;
    max-width: 440px;
    background: #0f1423;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 16px;
    padding: 1.25rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(131, 56, 236, 0.2);
    font-family: inherit;
    color: #f3f4f6;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    padding-bottom: 0.6rem;
    margin-bottom: 1rem;
  }

  .title-wrap {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .icon-key {
    color: #a855f7;
    font-size: 1.3rem;
  }

  .title-wrap h3 {
    font-size: 0.95rem;
    margin: 0;
    color: #fff;
  }

  .btn-close {
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
  }

  .one-click-card {
    background: rgba(0, 245, 212, 0.05);
    border: 1px solid rgba(0, 245, 212, 0.25);
    border-radius: 10px;
    padding: 0.75rem;
    margin-bottom: 1rem;
  }

  .btn-one-click {
    width: 100%;
    padding: 0.6rem 0.8rem;
    background: linear-gradient(135deg, rgba(0, 245, 212, 0.25), rgba(131, 56, 236, 0.35));
    border: 1px solid #00f5d4;
    border-radius: 8px;
    color: #00f5d4;
    font-size: 0.78rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-one-click:hover {
    background: linear-gradient(135deg, rgba(0, 245, 212, 0.4), rgba(131, 56, 236, 0.5));
    box-shadow: 0 0 15px rgba(0, 245, 212, 0.4);
  }

  .one-click-hint {
    font-size: 0.7rem;
    color: #9ca3af;
    margin: 0.4rem 0 0 0;
    text-align: center;
  }

  .divider {
    display: flex;
    align-items: center;
    text-align: center;
    font-size: 0.65rem;
    font-weight: 700;
    color: #6b7280;
    letter-spacing: 0.5px;
    margin: 0.8rem 0;
  }

  .divider::before, .divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .divider span {
    padding: 0 0.5rem;
  }

  .form-body {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #d1d5db;
  }

  .portal-link {
    font-size: 0.7rem;
    color: #00f5d4;
    text-decoration: underline;
  }

  .btn-paste {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 4px;
    padding: 0.1rem 0.4rem;
    color: #9ca3af;
    font-size: 0.68rem;
    cursor: pointer;
  }

  .input-field {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 8px;
    padding: 0.45rem 0.6rem;
    color: #f3f4f6;
    font-size: 0.8rem;
    outline: none;
  }

  .input-field:focus {
    border-color: #00f5d4;
  }

  .btn-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .btn-save {
    flex: 1.2;
    padding: 0.5rem;
    background: linear-gradient(135deg, #8338ec, #3a86c8);
    border: none;
    border-radius: 8px;
    color: #fff;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
  }

  .btn-clear {
    flex: 0.8;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 8px;
    color: #9ca3af;
    font-size: 0.78rem;
    cursor: pointer;
  }
</style>
