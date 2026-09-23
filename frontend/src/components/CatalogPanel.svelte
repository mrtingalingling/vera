<script>
  let {
    isOpen = false,
    onFetchCatalog = () => {},
    onSaveCatalog = () => {}
  } = $props();

  let claimText = $state("");
  let verdict = $state("verified");
  let accuracyConf = $state(95);
  let falsehoodConf = $state(5);
  let hallucinationLikelihood = $state(0);

  function handleSave() {
    const text = claimText.trim();
    if (!text) return;
    onSaveCatalog({
      claim: text,
      verdict,
      accuracy: accuracyConf,
      falsehood: falsehoodConf,
      hallucination: hallucinationLikelihood
    });
    claimText = "";
  }
</script>

{#if isOpen}
  <div class="catalog-panel">
    <div class="panel-header-desc">
      <span>Indexed Fact-Checks, Verdicts & Confidence Metrics in Firestore:</span>
    </div>

    <!-- Add Claim Check Form with Metrics -->
    <div class="add-claim-form">
      <input 
        type="text" 
        placeholder="Enter claim to record in catalog..." 
        bind:value={claimText}
        class="claim-input"
      />

      <div class="row-controls">
        <select bind:value={verdict} class="verdict-select">
          <option value="verified">Verdict: Verified (True)</option>
          <option value="misinformed">Verdict: Misinformed (False)</option>
          <option value="disputed">Verdict: Disputed</option>
          <option value="need-additional-context">Verdict: Needs Context</option>
        </select>

        <div class="metric-input-wrap" title="Accuracy Confidence (0-100%)">
          <label for="acc-input">Acc %</label>
          <input id="acc-input" type="number" min="0" max="100" bind:value={accuracyConf} class="metric-num" />
        </div>
      </div>

      <div class="row-controls">
        <div class="metric-input-wrap" title="Falsehood Confidence (0-100%)">
          <label for="false-input">False %</label>
          <input id="false-input" type="number" min="0" max="100" bind:value={falsehoodConf} class="metric-num" />
        </div>

        <div class="metric-input-wrap" title="Hallucination Likelihood (0-100%)">
          <label for="hal-input">Halluc %</label>
          <input id="hal-input" type="number" min="0" max="100" bind:value={hallucinationLikelihood} class="metric-num" />
        </div>

        <button type="button" class="btn-save-claim" onclick={handleSave}>
          Save Check
        </button>
      </div>
    </div>

    <!-- Fetch Database Catalog Trigger Button -->
    <button type="button" class="btn-fetch-catalog" onclick={onFetchCatalog}>
      <span class="material-symbols-outlined">pageview</span>
      <span>Fetch Database Catalog & Metrics Table</span>
    </button>
  </div>
{/if}

<style>
  .catalog-panel {
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

  .add-claim-form {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  .claim-input {
    width: 100%;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
    border-radius: 8px;
    padding: 0.45rem 0.65rem;
    color: var(--text, #f3f4f6);
    font-size: 0.78rem;
    outline: none;
    transition: all 0.2s ease;
  }

  .claim-input:focus {
    border-color: #00bbf9;
    background: rgba(255, 255, 255, 0.06);
  }

  .row-controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .verdict-select {
    flex: 1.5;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
    border-radius: 8px;
    padding: 0.4rem 0.5rem;
    color: var(--text, #f3f4f6);
    font-size: 0.74rem;
    outline: none;
  }

  .metric-input-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
    border-radius: 8px;
    padding: 0.2rem 0.4rem;
    gap: 0.25rem;
  }

  .metric-input-wrap label {
    font-size: 0.68rem;
    color: var(--text-muted, #a1a8b6);
  }

  .metric-num {
    width: 100%;
    background: transparent;
    border: none;
    color: var(--text, #f3f4f6);
    font-size: 0.74rem;
    font-weight: 600;
    outline: none;
  }

  .btn-save-claim {
    flex: 1;
    background: #00bbf9;
    color: #000;
    border: none;
    border-radius: 8px;
    padding: 0.45rem 0.6rem;
    font-size: 0.74rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .btn-save-claim:hover {
    box-shadow: 0 0 10px rgba(0, 187, 249, 0.3);
    transform: translateY(-0.5px);
  }

  .btn-fetch-catalog {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border, rgba(255, 255, 255, 0.12));
    border-radius: 8px;
    padding: 0.5rem;
    color: var(--text, #f3f4f6);
    font-size: 0.76rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-fetch-catalog span.material-symbols-outlined {
    font-size: 0.95rem;
    color: #00bbf9;
  }

  .btn-fetch-catalog:hover {
    background: rgba(255, 255, 255, 0.07);
    border-color: #00bbf9;
  }
</style>
