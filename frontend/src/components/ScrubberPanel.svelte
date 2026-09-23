<script>
  import { piiScrubber } from "../scrubber/piiScrubberService.js";

  let {
    isOpen = false,
    onVerifyOnDevice = () => {},
    onDocketToCourtroom = () => {},
    onToast = () => {}
  } = $props();

  let rawMessage = $state("");
  let isApproved = $state(false);

  let preview = $derived.by(() => {
    if (!rawMessage || !rawMessage.trim()) return null;
    return piiScrubber.createVerificationPreview(rawMessage);
  });

  function handleVerify() {
    if (!preview) return;
    preview.isApproved = true;
    onVerifyOnDevice(preview);
    onToast("⚡ Verifying sanitized claim on-device...");
  }

  function handleDocket() {
    if (!preview) return;
    preview.isApproved = true;
    onDocketToCourtroom(preview);
    onToast("⚖️ Claim prepped for clearCloud Courtroom!");
  }

  function handleSamplePaste() {
    rawMessage = "Listen bro, my doctor friend at Mayo Clinic says atmospheric CO2 reached 420 ppm in 2024. Contact bob@lab.org or call 555-123-4567 before they delete this!";
  }

  function handleClear() {
    rawMessage = "";
    isApproved = false;
  }
</script>

{#if isOpen}
  <div class="scrubber-panel">
    <div class="panel-header-desc">
      <span>🛡️ Private Messaging PII Scrubber (WhatsApp, Telegram, Signal, WeChat)</span>
      <span class="privacy-tag">Zero Cloud Leakage</span>
    </div>

    <div class="scrubber-input-group">
      <div class="textarea-header">
        <label for="raw-msg-input">Paste forwarded chat or private message:</label>
        <button type="button" class="sample-link" onclick={handleSamplePaste}>Paste Sample Chain Msg</button>
      </div>
      <textarea
        id="raw-msg-input"
        class="raw-textarea"
        placeholder="Paste message containing gossip, preambles, and personal contact info..."
        bind:value={rawMessage}
        rows="3"
      ></textarea>
    </div>

    {#if preview}
      <div class="preview-card">
        <div class="preview-header">
          <span class="material-symbols-outlined icon-shield">verified_user</span>
          <span class="preview-title">On-Device Sanitized Preview</span>
          <span class="redaction-badge">{preview.redactionCount} Redactions</span>
        </div>

        <div class="preview-section">
          <div class="preview-label">Sanitized Text:</div>
          <div class="sanitized-box">{preview.sanitizedText}</div>
        </div>

        <div class="preview-section highlight-section">
          <div class="preview-label">Isolated Core Claim:</div>
          <div class="core-claim-box">
            <span class="material-symbols-outlined claim-icon">bolt</span>
            <span class="claim-text">{preview.coreClaim}</span>
          </div>
        </div>

        <div class="actions-row">
          <button type="button" class="btn btn-verify" onclick={handleVerify}>
            <span class="material-symbols-outlined">memory</span>
            <span>Verify On-Device (Nano)</span>
          </button>

          <button type="button" class="btn btn-docket" onclick={handleDocket}>
            <span class="material-symbols-outlined">gavel</span>
            <span>Docket to clearCloud Courtroom</span>
          </button>

          <button type="button" class="btn btn-clear" onclick={handleClear}>
            Clear
          </button>
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  .scrubber-panel {
    background: var(--bg-surface, #1e222d);
    border: 1px solid var(--border, rgba(255, 255, 255, 0.12));
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .panel-header-desc {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--text-muted, #94a3b8);
    margin-bottom: 12px;
  }

  .privacy-tag {
    font-size: 0.72rem;
    color: #10b981;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.3);
    padding: 2px 8px;
    border-radius: 12px;
  }

  .scrubber-input-group {
    margin-bottom: 12px;
  }

  .textarea-header {
    display: flex;
    justify-content: space-between;
    font-size: 0.78rem;
    color: var(--text-muted, #94a3b8);
    margin-bottom: 6px;
  }

  .sample-link {
    background: none;
    border: none;
    color: #00f5d4;
    cursor: pointer;
    text-decoration: underline;
    font-size: 0.76rem;
    padding: 0;
  }

  .sample-link:hover {
    color: #7000ff;
  }

  .raw-textarea {
    width: 100%;
    background: rgba(0, 0, 0, 0.25);
    border: 1px solid var(--border, rgba(255, 255, 255, 0.15));
    border-radius: 8px;
    color: var(--text-color, #e2e8f0);
    padding: 10px;
    font-size: 0.85rem;
    resize: vertical;
    font-family: inherit;
    box-sizing: border-box;
  }

  .raw-textarea:focus {
    outline: none;
    border-color: #00f5d4;
  }

  .preview-card {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(0, 245, 212, 0.25);
    border-radius: 10px;
    padding: 14px;
    margin-top: 10px;
  }

  .preview-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }

  .icon-shield {
    color: #00f5d4;
    font-size: 1.2rem;
  }

  .preview-title {
    font-weight: 600;
    font-size: 0.85rem;
    color: #e2e8f0;
  }

  .redaction-badge {
    margin-left: auto;
    font-size: 0.72rem;
    color: #f59e0b;
    background: rgba(245, 158, 11, 0.15);
    padding: 2px 8px;
    border-radius: 10px;
    border: 1px solid rgba(245, 158, 11, 0.3);
  }

  .preview-section {
    margin-bottom: 10px;
  }

  .preview-label {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted, #94a3b8);
    margin-bottom: 4px;
  }

  .sanitized-box {
    font-size: 0.82rem;
    color: #cbd5e1;
    background: rgba(255, 255, 255, 0.04);
    padding: 8px 10px;
    border-radius: 6px;
    line-height: 1.4;
    word-break: break-word;
  }

  .highlight-section {
    background: rgba(0, 245, 212, 0.06);
    border: 1px solid rgba(0, 245, 212, 0.2);
    border-radius: 6px;
    padding: 8px 10px;
  }

  .core-claim-box {
    display: flex;
    align-items: flex-start;
    gap: 6px;
  }

  .claim-icon {
    color: #00f5d4;
    font-size: 1.1rem;
    margin-top: 1px;
  }

  .claim-text {
    font-size: 0.88rem;
    font-weight: 600;
    color: #ffffff;
  }

  .actions-row {
    display: flex;
    gap: 8px;
    margin-top: 14px;
    flex-wrap: wrap;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    font-size: 0.8rem;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
  }

  .btn-verify {
    background: linear-gradient(135deg, #00f5d4, #00b4d8);
    color: #0b0f19;
  }

  .btn-verify:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  .btn-docket {
    background: linear-gradient(135deg, #7000ff, #9d4edd);
    color: #ffffff;
  }

  .btn-docket:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  .btn-clear {
    background: rgba(255, 255, 255, 0.08);
    color: var(--text-muted, #94a3b8);
    margin-left: auto;
  }

  .btn-clear:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
  }
</style>
