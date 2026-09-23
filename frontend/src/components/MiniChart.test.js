import { describe, it, expect } from 'vitest';

function calculateMiniChartWidths(factsPct, opinionPct, falsehoodPct = 0) {
  const total = factsPct + opinionPct + falsehoodPct || 100;
  return {
    factsWidth: Math.min(100, Math.max(0, (factsPct / total) * 100)),
    opinionWidth: Math.min(100, Math.max(0, (opinionPct / total) * 100)),
    falseWidth: Math.min(100, Math.max(0, (falsehoodPct / total) * 100)),
    dominant: factsPct >= 70 ? "FACT-GROUNDED" : opinionPct >= 60 ? "OPINION / SPECULATION" : "BALANCED"
  };
}

describe('MiniChart State and Ratio Logic', () => {
  it('Row 14: calculates facts-grounded dominant state correctly', () => {
    const res = calculateMiniChartWidths(85, 15, 0);
    expect(res.factsWidth).toBe(85);
    expect(res.opinionWidth).toBe(15);
    expect(res.dominant).toBe("FACT-GROUNDED");
  });

  it('Row 15: calculates opinion / speculation dominant state correctly', () => {
    const res = calculateMiniChartWidths(20, 80, 0);
    expect(res.factsWidth).toBe(20);
    expect(res.opinionWidth).toBe(80);
    expect(res.dominant).toBe("OPINION / SPECULATION");
  });

  it('Row 16: handles edge cases and empty state safely without NaN', () => {
    const res = calculateMiniChartWidths(0, 0, 0);
    expect(res.factsWidth).toBe(0);
    expect(res.opinionWidth).toBe(0);
    expect(Number.isNaN(res.factsWidth)).toBe(false);
  });
});
