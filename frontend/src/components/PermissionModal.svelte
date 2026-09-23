<script>
  let {
    isOpen = false,
    currentDuration = "1h",
    onGrant = () => {},
    onDeny = () => {},
    onClose = () => {}
  } = $props();

  let selectedDuration = $state("1h");

  $effect(() => {
    if (currentDuration) {
      selectedDuration = currentDuration;
    }
  });

  function handleSelect(dur) {
    selectedDuration = dur;
  }

  function handleGrant() {
    onGrant(selectedDuration);
  }
</script>

{#if isOpen}
  <div class="permission-overlay" role="dialog" aria-modal="true">
    <div class="permission-modal">
      <div class="modal-shield">
        <span class="material-symbols-outlined">shield_person</span>
      </div>

      <div class="modal-text">
        <h2>Read Active Page?</h2>
        <p>Grant permission for Vera to read the text of the active browser tab to perform real-time verification.</p>
      </div>

      <div class="duration-options">
        <button
          type="button"
          class="duration-card {selectedDuration === 'once' ? 'selected' : ''}"
          onclick={() => handleSelect('once')}
        >
          <div class="duration-card-text">
            <div class="duration-label">Just once</div>
            <div class="duration-desc">Valid only for the very next query</div>
          </div>
          <div class="radio-dot"></div>
        </button>

        <button
          type="button"
          class="duration-card {selectedDuration === '15m' ? 'selected' : ''}"
          onclick={() => handleSelect('15m')}
        >
          <div class="duration-card-text">
            <div class="duration-label">For 15 Minutes</div>
            <div class="duration-desc">Access auto-expires in 15 minutes</div>
          </div>
          <div class="radio-dot"></div>
        </button>

        <button
          type="button"
          class="duration-card {selectedDuration === '1h' ? 'selected' : ''}"
          onclick={() => handleSelect('1h')}
        >
          <div class="duration-card-text">
            <div class="duration-label">For 1 Hour</div>
            <div class="duration-desc">Access auto-expires in 1 hour</div>
          </div>
          <div class="radio-dot"></div>
        </button>

        <button
          type="button"
          class="duration-card {selectedDuration === 'always' ? 'selected' : ''}"
          onclick={() => handleSelect('always')}
        >
          <div class="duration-card-text">
            <div class="duration-label">Always for this domain</div>
            <div class="duration-desc">Persistent access on this tab's domain</div>
          </div>
          <div class="radio-dot"></div>
        </button>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn-deny" onclick={onDeny}>Deny</button>
        <button type="button" class="btn-grant" onclick={handleGrant}>Grant Access</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .permission-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: flex-end;
    z-index: 1000;
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .permission-modal {
    background: #11131e;
    border: 1px solid rgba(255, 255, 255, 0.1);
    width: 100%;
    max-width: 480px;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    padding: 1.5rem 1.25rem;
    box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    animation: slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  .modal-shield {
    align-self: center;
    width: 52px;
    height: 52px;
    background: rgba(0, 245, 212, 0.08);
    border: 1px solid #00f5d4;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 16px rgba(0, 245, 212, 0.25);
  }

  .modal-shield span {
    font-size: 1.8rem;
    color: #00f5d4;
  }

  .modal-text {
    text-align: center;
  }

  .modal-text h2 {
    margin: 0 0 0.35rem 0;
    font-size: 1.15rem;
    font-weight: 700;
    color: #f3f4f6;
  }

  .modal-text p {
    margin: 0;
    font-size: 0.8rem;
    color: #9ca3af;
    line-height: 1.4;
  }

  .duration-options {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  .duration-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    padding: 0.6rem 0.85rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
    color: inherit;
    font-family: inherit;
    width: 100%;
  }

  .duration-card:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.15);
  }

  .duration-card.selected {
    background: rgba(0, 245, 212, 0.06);
    border-color: #00f5d4;
    box-shadow: 0 0 8px rgba(0, 245, 212, 0.15);
  }

  .duration-card-text {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .duration-label {
    font-size: 0.82rem;
    font-weight: 600;
    color: #f3f4f6;
  }

  .duration-desc {
    font-size: 0.7rem;
    color: #9ca3af;
  }

  .radio-dot {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.25);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .duration-card.selected .radio-dot {
    border-color: #00f5d4;
  }

  .duration-card.selected .radio-dot::after {
    content: '';
    width: 8px;
    height: 8px;
    background: #00f5d4;
    border-radius: 50%;
  }

  .modal-actions {
    display: flex;
    gap: 0.65rem;
    margin-top: 0.35rem;
  }

  .modal-actions button {
    flex: 1;
    padding: 0.7rem;
    border: none;
    border-radius: 10px;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
  }

  .btn-grant {
    background: linear-gradient(135deg, #00f5d4 0%, #00bbf9 100%);
    color: #000;
    box-shadow: 0 2px 10px rgba(0, 245, 212, 0.3);
  }

  .btn-grant:hover {
    box-shadow: 0 4px 14px rgba(0, 245, 212, 0.4);
    transform: translateY(-0.5px);
  }

  .btn-deny {
    background: rgba(255, 255, 255, 0.05);
    color: #f3f4f6;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .btn-deny:hover {
    background: rgba(255, 255, 255, 0.08);
  }
</style>
