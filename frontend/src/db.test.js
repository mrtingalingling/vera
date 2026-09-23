import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveMessageToDB,
  loadMessagesFromDB,
  clearMessagesFromDB,
  savePremisesToDB,
  loadPremisesFromDB,
  cacheClaimEvaluation,
  getCachedClaimEvaluation
} from './db.js';

describe('Vera Client DB (IndexedDB & Fallback) Unit Tests', () => {
  beforeEach(async () => {
    await clearMessagesFromDB();
  });

  it('test_save_and_load_messages', async () => {
    const msg1 = { id: 101, role: 'user', text: 'First test claim' };
    const msg2 = { id: 102, role: 'agent', text: 'Verified true', metrics: { factsPct: 90, opinionPct: 10, falsehoodPct: 0 } };

    await saveMessageToDB(msg1);
    await saveMessageToDB(msg2);

    const loaded = await loadMessagesFromDB();
    expect(loaded.length).toBe(2);
    expect(loaded[0].text).toBe('First test claim');
    expect(loaded[1].metrics.factsPct).toBe(90);
  });

  it('test_clear_messages', async () => {
    await saveMessageToDB({ id: 201, role: 'user', text: 'Temporary message' });
    let loaded = await loadMessagesFromDB();
    expect(loaded.length).toBeGreaterThan(0);

    await clearMessagesFromDB();
    loaded = await loadMessagesFromDB();
    expect(loaded.length).toBe(0);
  });

  it('test_save_and_load_premises', async () => {
    const premises = [
      { id: 'p1', text: 'Standard operating baseline: fact A', active: true },
      { id: 'p2', text: 'Consensus document: fact B', active: false }
    ];

    await savePremisesToDB(premises);
    const loaded = await loadPremisesFromDB();
    expect(loaded.length).toBe(2);
    expect(loaded[0].text).toBe('Standard operating baseline: fact A');
    expect(loaded[1].active).toBe(false);
  });

  it('test_claim_cache_and_retrieval', async () => {
    const hash = '0xabc123456789';
    const claimData = {
      claimText: 'The Moon orbits the Earth',
      verdict: 'verified',
      confidence: 99
    };

    await cacheClaimEvaluation(hash, claimData);
    const cached = await getCachedClaimEvaluation(hash);

    expect(cached).not.toBeNull();
    expect(cached.claimText).toBe('The Moon orbits the Earth');
    expect(cached.verdict).toBe('verified');
  });

  it('test_claim_cache_missing_hash_returns_null', async () => {
    const cached = await getCachedClaimEvaluation('0xnonexistent');
    expect(cached).toBeNull();
  });
});
