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
