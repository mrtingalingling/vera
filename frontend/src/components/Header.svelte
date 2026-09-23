<script>
  let {
    isUncapped = false,
    remainingQueries = 15,
    isDarkMode = true,
    p2pStatus = "connected",
    peersCount = 2,
    onToggleTheme = () => {},
    onOpenByom = () => {}
  } = $props();
</script>

<header class="frame-header">
  <div class="brand">
    <span class="material-symbols-outlined brand-icon">security</span>
    <h1>Vera</h1>

    <button class="btn-icon" onclick={onToggleTheme} title="Toggle theme">
      <span class="material-symbols-outlined">
        {isDarkMode ? "light_mode" : "dark_mode"}
      </span>
    </button>

    <button 
      class="btn-icon btn-byom {isUncapped ? 'uncapped-glow' : ''}" 
      onclick={onOpenByom} 
      title="Bring Your Own Agent / 1-Click Connect"
    >
      <span class="material-symbols-outlined">key</span>
    </button>

    <span class="badge badge-p2p" title="Decentralized P2P Swarm Gossip ({peersCount} peers active)">
      ⚡ P2P ({peersCount})
    </span>

    {#if isUncapped}
      <span class="badge badge-uncapped" title="Queries without limit active">
        UNCAPPED
      </span>
    {:else}
      <span class="badge badge-limited" title="{remainingQueries} free queries remaining today">
        {remainingQueries}/15 Left
      </span>
    {/if}
  </div>
</header>

<style>
  .frame-header {
    padding: 0.65rem 0.85rem;
    border-bottom: 1px solid var(--border, rgba(255, 255, 255, 0.08));
    background: var(--bg-header, rgba(15, 20, 35, 0.95));
    backdrop-filter: blur(8px);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .brand-icon {
    color: #00f5d4;
    font-size: 1.25rem;
  }

  h1 {
    font-size: 0.95rem;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(135deg, #00f5d4, #8338ec);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .btn-icon {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
    border-radius: 6px;
    color: var(--text-muted, #9ca3af);
    padding: 0.2rem 0.35rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-left: 0.2rem;
  }

  .btn-icon span {
    font-size: 0.95rem;
  }

  .btn-byom {
    background: rgba(131, 56, 236, 0.15);
    border-color: #8338ec;
    color: #a855f7;
  }

  .uncapped-glow {
    box-shadow: 0 0 10px rgba(0, 245, 212, 0.35);
    border-color: #00f5d4;
    color: #00f5d4;
  }

  .badge {
    margin-left: auto;
    font-size: 0.68rem;
    font-weight: 700;
    padding: 0.15rem 0.45rem;
    border-radius: 12px;
    letter-spacing: 0.3px;
  }

  .badge-p2p {
    margin-left: auto;
    background: rgba(131, 56, 236, 0.15);
    color: #c084fc;
    border: 1px solid rgba(131, 56, 236, 0.35);
  }

  .badge-limited {
    background: rgba(0, 245, 212, 0.1);
    color: #00f5d4;
    border: 1px solid rgba(0, 245, 212, 0.25);
  }

  .badge-uncapped {
    background: rgba(0, 245, 212, 0.2);
    color: #00f5d4;
    border: 1px solid #00f5d4;
    box-shadow: 0 0 8px rgba(0, 245, 212, 0.25);
  }
</style>
