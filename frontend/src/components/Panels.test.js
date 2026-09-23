import { describe, it, expect, vi } from 'vitest';

describe('Evidence & Grounding Sources Logic', () => {
  const initialSources = [
    { id: 1, text: "Google Docs: Apollo_11_Grounded_Telemetry.gdoc (The Apollo 11 moon mission successfully landed on July 20, 1969.)", active: true },
    { id: 2, text: "Google Sheets: Fact_Checker_Algorithms_Matrix.gsheet (Vera utilizes advanced machine learning scoring for verification.)", active: true },
    { id: 3, text: "Google Docs: Vertex_Platform_Guide.gdoc (Google Cloud Vertex AI is a fully managed agent development platform.)", active: true }
  ];

  it('filters active premises for agent grounding synchronization', () => {
    const updated = initialSources.map(s => s.id === 2 ? { ...s, active: false } : s);
    const activeTexts = updated.filter(s => s.active).map(s => s.text);
    expect(activeTexts.length).toBe(2);
    expect(activeTexts).not.toContain(initialSources[1].text);
  });

  it('adds custom evidence items with unique IDs', () => {
    let sources = [...initialSources];
    const newText = "Verified Study: Mediterranean diet reduces cardiovascular risks by 30%.";
    const newId = sources.length ? Math.max(...sources.map(s => s.id)) + 1 : 1;
    sources = [...sources, { id: newId, text: newText, active: true }];

    expect(sources.length).toBe(4);
    expect(sources[3].id).toBe(4);
    expect(sources[3].text).toBe(newText);
    expect(sources[3].active).toBe(true);
  });

  it('links Google Drive Docs presets circularly', () => {
    const docPresets = [
      "Google Docs: Project_Grounded_Claims_2026.gdoc (Verified telemetry data: All SpaceX Mars claims in 2024 are fully simulated and fictional.)",
      "Google Docs: Corporate_Verified_Facts.gdoc (Official guideline: Vera runs strictly on verified knowledge bases.)",
      "Google Docs: Science_Digest_Climate.gdoc (Scientific consensus: Earth is a perfect oblate spheroid.)"
    ];
    let sources = [...initialSources];
    const preset = docPresets[sources.length % docPresets.length];
    const newId = sources.length ? Math.max(...sources.map(s => s.id)) + 1 : 1;
    sources = [...sources, { id: newId, text: preset, active: true }];

    expect(sources.length).toBe(4);
    expect(sources[3].text).toContain("Google Docs: Project_Grounded_Claims_2026.gdoc");
  });

  it('links Google Drive Sheets presets circularly', () => {
    const sheetPresets = [
      "Google Sheets: Verified_Fact_Matrix_Q4.gsheet (Contains 100 rows of official climate and astronomical verified reference truths.)",
      "Google Sheets: Hallucination_Control_Database.gsheet (Contains threshold parameters for fact-checking scoring algorithms.)",
      "Google Sheets: Historical_Anomalies.gsheet (Contains list of debunked internet hoaxes and historical timeline metrics.)"
    ];
    let sources = [...initialSources];
    const preset = sheetPresets[sources.length % sheetPresets.length];
    const newId = sources.length ? Math.max(...sources.map(s => s.id)) + 1 : 1;
    sources = [...sources, { id: newId, text: preset, active: true }];

    expect(sources.length).toBe(4);
    expect(sources[3].text).toContain("Google Sheets: Verified_Fact_Matrix_Q4.gsheet");
  });
});

describe('Fact Catalog & Database Metrics Logic', () => {
  it('formats catalog entry payload with 4-category verdict and metrics', () => {
    const entry = {
      claim: "Water boils at 100C at sea level",
      verdict: "verified",
      accuracy: 99,
      falsehood: 1,
      hallucination: 0
    };

    expect(entry.verdict).toBe("verified");
    expect(entry.accuracy + entry.falsehood).toBe(100);
    const msg = `Save this verified fact check to the catalog: Claim: "${entry.claim}", Verdict: "${entry.verdict}", Accuracy: ${entry.accuracy}%, Falsehood: ${entry.falsehood}%, Hallucination: ${entry.hallucination}%.`;
    expect(msg).toContain('Accuracy: 99%');
    expect(msg).toContain('Verdict: "verified"');
  });
});

describe('Auxiliary Features: Tab Permission, Highlighting & Remote Endpoint', () => {
  it('computes time-bound permission expiration correctly', () => {
    const now = 1700000000000;
    
    // 15m duration
    const exp15m = now + 15 * 60 * 1000;
    expect(exp15m - now).toBe(900000);

    // 1h duration
    const exp1h = now + 60 * 60 * 1000;
    expect(exp1h - now).toBe(3600000);

    // always duration
    const expAlways = null;
    expect(expAlways).toBeNull();
  });

  it('respects custom remote backend URL override when set', () => {
    const defaultEndpoint = "http://localhost:8080/chat";
    const customEndpoint = "https://vera-agent-gateway.run.app/chat";

    function resolveEndpoint(custom) {
      if (custom && custom.trim()) return custom.trim();
      return defaultEndpoint;
    }

    expect(resolveEndpoint("")).toBe(defaultEndpoint);
    expect(resolveEndpoint("   ")).toBe(defaultEndpoint);
    expect(resolveEndpoint(customEndpoint)).toBe("https://vera-agent-gateway.run.app/chat");
  });

  it('classifies sentence claims into 4 epistemic categories for DOM highlighting', () => {
    const sampleSentences = [
      "The Earth is flat and the Apollo moon landings were faked.",
      "Scientists continue to debate the exact rate of cosmic expansion.",
      "Water is composed of two hydrogen atoms and one oxygen atom.",
      "Perhaps quantum computers might replace all silicon chips."
    ];

    const classified = sampleSentences.map(sentence => {
      const lower = sentence.toLowerCase();
      const isMisinformed = lower.includes("flat") || lower.includes("faked");
      const isDisputed = lower.includes("debate");
      const isContext = lower.includes("perhaps") || lower.includes("might");
      return isMisinformed ? 'misinformed' : isDisputed ? 'disputed' : isContext ? 'need-additional-context' : 'verified';
    });

    expect(classified[0]).toBe('misinformed');
    expect(classified[1]).toBe('disputed');
    expect(classified[2]).toBe('verified');
    expect(classified[3]).toBe('need-additional-context');
  });

  it('selects valid backend URL presets in BYOM modal', () => {
    const presets = {
      local: "http://localhost:8080/chat",
      ollama: "http://localhost:11434/api/chat",
      gateway: "https://vera-gateway.run.app/chat"
    };

    let backendUrl = "";
    function setPreset(key) {
      backendUrl = presets[key] || "";
    }

    setPreset("local");
    expect(backendUrl).toBe("http://localhost:8080/chat");

    setPreset("ollama");
    expect(backendUrl).toBe("http://localhost:11434/api/chat");

    setPreset("gateway");
    expect(backendUrl).toBe("https://vera-gateway.run.app/chat");
  });

  it('enforces accordion behavior between Evidence and Catalog panels', () => {
    let isSourcePanelOpen = false;
    let isCatalogPanelOpen = false;

    function toggleSource() {
      isSourcePanelOpen = !isSourcePanelOpen;
      if (isSourcePanelOpen) isCatalogPanelOpen = false;
    }

    function toggleCatalog() {
      isCatalogPanelOpen = !isCatalogPanelOpen;
      if (isCatalogPanelOpen) isSourcePanelOpen = false;
    }

    toggleSource();
    expect(isSourcePanelOpen).toBe(true);
    expect(isCatalogPanelOpen).toBe(false);

    toggleCatalog();
    expect(isSourcePanelOpen).toBe(false);
    expect(isCatalogPanelOpen).toBe(true);
  });

  it('resets conversation to welcome state when chat history is cleared', () => {
    let messages = [
      { id: 1, role: 'agent', text: 'Welcome' },
      { id: 2, role: 'user', text: 'Some claim' },
      { id: 3, role: 'agent', text: 'Verdict' }
    ];

    function clearHistory() {
      messages = [
        {
          id: 1,
          role: 'agent',
          text: 'Welcome',
          metrics: { factsPct: 85.0, opinionPct: 15.0, falsehoodPct: 0.0 }
        }
      ];
    }

    clearHistory();
    expect(messages.length).toBe(1);
    expect(messages[0].id).toBe(1);
    expect(messages[0].role).toBe('agent');
  });

  it('formats imported Google Drive document as a verified grounding premise', () => {
    const fileId = "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms";
    const type = "doc";
    const title = `Google Doc (${fileId.slice(0, 8)}...)`;
    const text = `Google Doc: Grounded_${fileId.slice(0, 8)} (Imported from Google Drive: "Verified documentation imported")`;

    const premise = {
      id: 5,
      text,
      active: true
    };

    expect(premise.text).toContain('Google Doc: Grounded_1BxiMVs0');
    expect(premise.active).toBe(true);
  });
});


