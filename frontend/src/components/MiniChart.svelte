<script>
  let { factsPct = 85.0, opinionPct = 15.0, falsehoodPct = 0.0, title = "Verifiable Facts vs. Opinion / Speculation" } = $props();

  let total = $derived(factsPct + opinionPct + falsehoodPct || 100);
  let factsWidth = $derived(Math.min(100, Math.max(0, (factsPct / total) * 100)));
  let opinionWidth = $derived(Math.min(100, Math.max(0, (opinionPct / total) * 100)));
  let falseWidth = $derived(Math.min(100, Math.max(0, (falsehoodPct / total) * 100)));

  let statusLabel = $derived(
    factsPct >= 70 ? "FACT-GROUNDED" :
    opinionPct >= 60 ? "OPINION / SPECULATION" :
    falsehoodPct >= 50 ? "DISPUTED / FALSE" : "BALANCED RATIO"
  );

  let statusColor = $derived(
    factsPct >= 70 ? "#2ed573" :
    opinionPct >= 60 ? "#a855f7" :
    falsehoodPct >= 50 ? "#ff4757" : "#00f5d4"
  );
</script>

<div class="mini-chart-card">
  <div class="chart-header">
    <div class="chart-title">
      <span class="material-symbols-outlined icon">analytics</span>
      <span>{title}</span>
    </div>
    <span class="status-badge" style="color: {statusColor}; border-color: {statusColor}44; background: {statusColor}18;">
      {statusLabel}
    </span>
  </div>

  <div class="bar-track">
    <div 
      class="bar-segment bar-facts" 
      style="width: {factsWidth}%;"
      title="Verifiable Facts: {factsPct}%"
    ></div>
    <div 
      class="bar-segment bar-opinion" 
      style="width: {opinionWidth}%;"
      title="Opinion / Speculation: {opinionPct}%"
    ></div>
    {#if falseWidth > 0}
      <div 
        class="bar-segment bar-false" 
        style="width: {falseWidth}%;"
        title="Disputed / Falsehood: {falsehoodPct}%"
      ></div>
    {/if}
  </div>

  <div class="chart-legend">
    <div class="legend-item">
      <span class="legend-dot dot-facts"></span>
      <span class="legend-label">Verifiable Facts:</span>
      <strong class="legend-val val-facts">{factsPct}%</strong>
    </div>
    <div class="legend-item">
      <span class="legend-dot dot-opinion"></span>
      <span class="legend-label">Opinion / Speculation:</span>
      <strong class="legend-val val-opinion">{opinionPct}%</strong>
    </div>
    {#if falsehoodPct > 0}
      <div class="legend-item">
        <span class="legend-dot dot-false"></span>
        <span class="legend-label">Disputed / False:</span>
        <strong class="legend-val val-false">{falsehoodPct}%</strong>
      </div>
    {/if}
  </div>
</div>

<style>
  .mini-chart-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
    border-radius: 12px;
    padding: 0.65rem 0.75rem;
    margin: 0.4rem 0.5rem;
    font-family: inherit;
  }

  .chart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .chart-title {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text, #f3f4f6);
  }

  .chart-title .icon {
    font-size: 0.95rem;
    color: #00f5d4;
  }

  .status-badge {
    font-size: 0.65rem;
    font-weight: 700;
    padding: 0.15rem 0.45rem;
    border-radius: 12px;
    border: 1px solid;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .bar-track {
    display: flex;
    height: 8px;
    border-radius: 6px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.06);
    margin-bottom: 0.5rem;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .bar-segment {
    height: 100%;
    transition: width 0.4s ease;
  }

  .bar-facts {
    background: linear-gradient(90deg, #2ed573, #00f5d4);
  }

  .bar-opinion {
    background: linear-gradient(90deg, #a855f7, #6366f1);
  }

  .bar-false {
    background: #ff4757;
  }

  .chart-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    font-size: 0.7rem;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .legend-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  .dot-facts { background: #2ed573; box-shadow: 0 0 6px rgba(46, 213, 115, 0.5); }
  .dot-opinion { background: #a855f7; box-shadow: 0 0 6px rgba(168, 85, 247, 0.5); }
  .dot-false { background: #ff4757; }

  .legend-label {
    color: var(--text-muted, #9ca3af);
  }

  .legend-val {
    color: var(--text, #f3f4f6);
  }

  .val-facts { color: #2ed573; }
  .val-opinion { color: #c084fc; }
  .val-false { color: #ff6b81; }
</style>
