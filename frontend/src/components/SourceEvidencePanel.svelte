<script>
  let {
    isOpen = false,
    sources = [],
    onAddSource = () => {},
    onToggleSource = () => {},
    onLinkDoc = () => {},
    onLinkSheet = () => {},
    onShareFact = () => {}
  } = $props();

  let customInput = $state("");

  function handleAdd() {
    const text = customInput.trim();
    if (!text) return;
    onAddSource(text);
    customInput = "";
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  }
</script>

{#if isOpen}
  <div class="evidence-panel">
    <div class="panel-header-desc">
      <span>Grounding evidence & Google Drive references active for this session:</span>
    </div>

    <!-- Form to Add Custom Evidence or Links -->
    <div class="add-evidence-form">
      <div class="input-row">
        <input 
          type="text" 
          placeholder="Add custom fact, evidence or source link..." 
          bind:value={customInput}
          onkeydown={handleKeyDown}
          class="evidence-input"
        />
        <button type="button" class="btn-add" onclick={handleAdd}>Add</button>
      </div>

      <!-- Google Drive / Google Workspace Link Buttons -->
      <div class="workspace-btn-row">
        <button type="button" class="btn-workspace doc-btn" onclick={onLinkDoc}>
          <span class="material-symbols-outlined icon-doc">description</span>
          <span>Link Google Doc</span>
        </button>
        <button type="button" class="btn-workspace sheet-btn" onclick={onLinkSheet}>
          <span class="material-symbols-outlined icon-sheet">table_chart</span>
          <span>Link Google Sheet</span>
        </button>
      </div>
    </div>

    <!-- List of Evidence / Grounding Sources -->
    <div class="sources-list">
      {#if sources.length === 0}
        <div class="empty-sources">
          <span class="material-symbols-outlined">folder_open</span>
          <p>No evidence added yet.<br>Add custom facts or link Google Drive files above.</p>
        </div>
      {:else}
        {#each sources as src (src.id)}
          <div class="source-card {src.active ? 'active' : 'inactive'}">
            <span class="source-text" title={src.text}>{src.text}</span>
            <div class="source-actions">
              <button 
                type="button" 
                class="btn-share" 
                title="Share to global community pool"
                onclick={() => onShareFact(src.text)}
              >
                <span class="material-symbols-outlined">share</span>
              </button>
              
              <label class="switch" title="Toggle inclusion in active session grounding">
                <input 
                  type="checkbox" 
                  checked={src.active} 
                  onchange={(e) => onToggleSource(src.id, e.target.checked)}
                />
                <span class="slider"></span>
              </label>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
{/if}

<style>
  .evidence-panel {
    padding: 0.75rem 1rem;
    background: rgba(9, 10, 16, 0.7);
    border-bottom: 1px solid var(--border, rgba(255, 255, 255, 0.08));
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .panel-header-desc {
    font-size: 0.72rem;
    color: var(--text-muted, #a1a8b6);
  }

  .add-evidence-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .input-row {
    display: flex;
    gap: 0.5rem;
  }

  .evidence-input {
    flex: 1;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
    border-radius: 8px;
    padding: 0.45rem 0.65rem;
    color: var(--text, #f3f4f6);
    font-size: 0.78rem;
    outline: none;
    transition: all 0.2s ease;
  }

  .evidence-input:focus {
    border-color: #00f5d4;
    background: rgba(255, 255, 255, 0.06);
  }

  .btn-add {
    background: #00f5d4;
    color: #000;
    border: none;
    border-radius: 8px;
    padding: 0 0.9rem;
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-add:hover {
    box-shadow: 0 0 10px rgba(0, 245, 212, 0.3);
    transform: translateY(-0.5px);
  }

  .workspace-btn-row {
    display: flex;
    gap: 0.5rem;
  }

  .btn-workspace {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    padding: 0.45rem 0.6rem;
    font-size: 0.72rem;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid transparent;
  }

  .doc-btn {
    background: rgba(66, 133, 244, 0.12);
    border-color: rgba(66, 133, 244, 0.35);
    color: #ffffff;
  }

  .doc-btn:hover {
    background: rgba(66, 133, 244, 0.22);
    border-color: #4285F4;
  }

  .icon-doc {
    font-size: 0.95rem;
    color: #4285F4;
  }

  .sheet-btn {
    background: rgba(52, 168, 83, 0.12);
    border-color: rgba(52, 168, 83, 0.35);
    color: #ffffff;
  }

  .sheet-btn:hover {
    background: rgba(52, 168, 83, 0.22);
    border-color: #34A853;
  }

  .icon-sheet {
    font-size: 0.95rem;
    color: #34A853;
  }

  .sources-list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    max-height: 170px;
    overflow-y: auto;
  }

  .sources-list::-webkit-scrollbar {
    width: 4px;
  }

  .sources-list::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 4px;
  }

  .empty-sources {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    color: var(--text-muted, #a1a8b6);
    text-align: center;
    gap: 0.3rem;
    opacity: 0.75;
  }

  .empty-sources span {
    font-size: 1.8rem;
    color: rgba(255, 255, 255, 0.2);
  }

  .empty-sources p {
    font-size: 0.72rem;
    margin: 0;
  }

  .source-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
    border-radius: 8px;
    padding: 0.4rem 0.6rem;
    gap: 0.5rem;
    transition: all 0.2s ease;
  }

  .source-card.inactive {
    opacity: 0.45;
  }

  .source-text {
    font-size: 0.74rem;
    color: var(--text, #f3f4f6);
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .source-actions {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-shrink: 0;
  }

  .btn-share {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
    border-radius: 6px;
    color: var(--text-muted, #a1a8b6);
    cursor: pointer;
    display: flex;
    padding: 0.2rem;
    transition: all 0.2s ease;
  }

  .btn-share span {
    font-size: 0.85rem;
  }

  .btn-share:hover {
    border-color: #00f5d4;
    color: #00f5d4;
  }

  /* Custom Toggle Switch */
  .switch {
    position: relative;
    display: inline-block;
    width: 28px;
    height: 16px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.1);
    transition: 0.25s;
    border-radius: 16px;
    border: 1px solid var(--border, rgba(255, 255, 255, 0.15));
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 10px;
    width: 10px;
    left: 2px;
    bottom: 2px;
    background-color: var(--text-muted, #a1a8b6);
    transition: 0.25s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: rgba(0, 245, 212, 0.18);
    border-color: #00f5d4;
  }

  input:checked + .slider:before {
    transform: translateX(12px);
    background-color: #00f5d4;
  }
</style>
