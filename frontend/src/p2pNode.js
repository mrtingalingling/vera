/**
 * Vera P2P Node abstraction for decentralized browser-to-browser gossip and claim synchronization.
 * Designed to integrate with libp2p and WebRTC data channels.
 */

function generatePeerId() {
  const rand = Math.random().toString(36).substring(2, 10);
  return `vera-peer-${rand}`;
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `0x${Math.abs(hash).toString(16).padStart(8, '0')}`;
}

export function createP2PNode(options = {}) {
  const peerId = options.peerId || generatePeerId();
  let status = 'connected';
  const peers = options.peers || ['peer-bootstrap-1', 'peer-bootstrap-2'];
  const verifiedPool = [];
  const subscribers = new Set();

  return {
    peerId,
    get status() {
      return status;
    },
    get peers() {
      return [...peers];
    },
    async publishClaim(claim) {
      const claimText = claim.claimText || (typeof claim === 'string' ? claim : '');
      const hash = simpleHash(`${claimText}:${claim.verdict}:${Date.now()}`);
      
      const record = {
        hash,
        claim: {
          claimText,
          verdict: claim.verdict || 'verified',
          confidence: claim.confidence || 90,
          sources: claim.sources || ['P2P Swarm Consensus']
        },
        timestamp: Date.now(),
        peerId,
        signature: `sig-${simpleHash(peerId + hash)}`
      };

      verifiedPool.push(record);

      // Notify local and gossip subscribers
      for (const cb of subscribers) {
        try {
          cb(record);
        } catch (e) {
          console.error('[Vera P2P] Subscriber error:', e);
        }
      }

      return record;
    },
    subscribeClaims(callback) {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    },
    getVerifiedPool() {
      return [...verifiedPool];
    },
    disconnect() {
      status = 'disconnected';
    }
  };
}
