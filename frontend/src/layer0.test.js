import { describe, it, expect, vi } from 'vitest';
import { createP2PNode } from './p2pNode.js';
import { analyzeClaimLocally } from './localAiService.js';
import { scanPageContent, highlightPageContent } from './scannerService.js';

describe('Layer 0 Truth Table Tests', () => {
  // Row 1: Extension scan page success
  it('test_extension_scan_page_success', async () => {
    const mockSendMessage = vi.fn().mockImplementation((tabId, msg, callback) => {
      if (msg.action === 'GET_PAGE_CONTENT') {
        callback({ status: 'success', text: 'Earth orbits the Sun in 365 days.', title: 'Solar System' });
      }
    });

    const mockChrome = {
      tabs: {
        query: vi.fn().mockImplementation((query, cb) => cb([{ id: 42, title: 'Solar System' }])),
        sendMessage: mockSendMessage
      }
    };

    const res = await scanPageContent(mockChrome, '');
    expect(res.status).toBe('success');
    expect(res.text).toBe('Earth orbits the Sun in 365 days.');
    expect(mockSendMessage).toHaveBeenCalledWith(42, { action: 'GET_PAGE_CONTENT' }, expect.any(Function));
  });

  // Row 2: Web standalone scan page fallback
  it('test_web_scan_page_fallback', async () => {
    const res = await scanPageContent(null, 'Fallback input text from user');
    expect(res.status).toBe('fallback');
    expect(res.text).toBe('Fallback input text from user');
    expect(res.warning).toContain('Vera Chrome Extension');
  });

  // Row 3: Local in-browser worker routing
  it('test_byom_local_worker_routing', async () => {
    const analysis = await analyzeClaimLocally('Water boils at 100 degrees Celsius at sea level.');
    expect(analysis.metrics).toBeDefined();
    expect(analysis.metrics.factsPct).toBeGreaterThan(70);
    expect(analysis.metrics.falsehoodPct).toBe(0);
    expect(analysis.claims.length).toBeGreaterThan(0);
    expect(analysis.claims[0].verdict).toBe('verified');
  });

  // Row 4: P2P claim broadcast
  it('test_p2p_claim_broadcast', async () => {
    const node = createP2PNode({ peerId: 'peer-test-1' });
    expect(node.peerId).toBe('peer-test-1');
    expect(node.status).toBe('connected');

    const published = await node.publishClaim({
      claimText: 'Earth is roughly 4.5 billion years old.',
      verdict: 'verified',
      confidence: 99
    });

    expect(published.hash).toBeDefined();
    expect(published.claim.claimText).toBe('Earth is roughly 4.5 billion years old.');
    expect(node.getVerifiedPool().length).toBe(1);
  });

  // Row 5: P2P claim subscription
  it('test_p2p_claim_subscription', async () => {
    const nodeA = createP2PNode({ peerId: 'peer-alice' });
    const received = [];

    const unsubscribe = nodeA.subscribeClaims((item) => {
      received.push(item);
    });

    await nodeA.publishClaim({
      claimText: 'The human body has 206 bones.',
      verdict: 'verified',
      confidence: 95
    });

    expect(received.length).toBe(1);
    expect(received[0].claim.claimText).toBe('The human body has 206 bones.');
    unsubscribe();
  });

  // Row 6: 4-category verdict classification
  it('test_parser_4_categories', async () => {
    const falseAnalysis = await analyzeClaimLocally('Humans landed on Mars in 2024.');
    expect(falseAnalysis.metrics.falsehoodPct).toBeGreaterThan(50);
    expect(falseAnalysis.claims[0].verdict).toBe('misinformed');

    const specAnalysis = await analyzeClaimLocally('I think AI might replace programmers completely by next year.');
    expect(specAnalysis.metrics.opinionPct).toBeGreaterThan(50);
    expect(specAnalysis.claims[0].verdict).toBe('need-additional-context');
  });

  // Row 7: Google Chrome Gemini Nano integration & fallback
  it('test_gemini_nano_integration_and_fallback', async () => {
    const { getGeminiNanoAvailability, promptGeminiNano } = await import('./localAiService.js');

    // Case A: Default Node environment (window.ai is undefined) -> returns 'no'
    const statusNo = await getGeminiNanoAvailability();
    expect(statusNo).toBe('no');

    // Case B: Mock window.ai.languageModel available
    const mockSession = {
      prompt: vi.fn().mockResolvedValue(JSON.stringify({
        verdict: 'verified',
        confidence: 97,
        factsPct: 95,
        opinionPct: 5,
        falsehoodPct: 0,
        explanation: 'Empirically proven by astronomical models.'
      })),
      destroy: vi.fn()
    };

    globalThis.window = {
      ai: {
        languageModel: {
          capabilities: vi.fn().mockResolvedValue({ available: 'readily' }),
          create: vi.fn().mockResolvedValue(mockSession)
        }
      }
    };

    const statusReady = await getGeminiNanoAvailability();
    expect(statusReady).toBe('readily');

    const result = await analyzeClaimLocally('Jupiter has 95 recognized moons.');
    expect(result.text).toContain('[Vera On-Device Gemini Nano]');
    expect(result.claims[0].verdict).toBe('verified');
    expect(result.metrics.factsPct).toBe(95);
    expect(mockSession.destroy).toHaveBeenCalled();

    // Clean up mock
    delete globalThis.window;
  });
});
