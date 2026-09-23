/**
 * Vera Client-Side IndexedDB Storage Service (VeraDB)
 * Provides offline-first persistence for:
 * 1. Conversation History (messages)
 * 2. Grounding Evidence & Sources (premises)
 * 3. Evaluated Claims & Veracity Cache (claims_cache)
 * 
 * Guarantees zero cloud data leakage.
 */

const DB_NAME = 'VeraDB';
const DB_VERSION = 1;

let memoryFallback = {
  messages: [],
  premises: [],
  claims_cache: {}
};

/**
 * Opens or initializes the Vera IndexedDB instance.
 * @returns {Promise<IDBDatabase|null>}
 */
export function openDB() {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('messages')) {
          db.createObjectStore('messages', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('premises')) {
          db.createObjectStore('premises', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('claims_cache')) {
          db.createObjectStore('claims_cache', { keyPath: 'hash' });
        }
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (err) => {
        console.warn('[VeraDB] Error opening IndexedDB:', err);
        resolve(null);
      };
    } catch (e) {
      console.warn('[VeraDB] IndexedDB open exception:', e);
      resolve(null);
    }
  });
}

// -------------------------------------------------------------
// Messages Store (Conversation History)
// -------------------------------------------------------------

export async function saveMessageToDB(message) {
  if (!message || message.id === undefined) return;
  const db = await openDB();
  if (!db) {
    memoryFallback.messages.push(message);
    return;
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction('messages', 'readwrite');
      const store = tx.objectStore('messages');
      store.put(message);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function loadMessagesFromDB() {
  const db = await openDB();
  if (!db) {
    return [...memoryFallback.messages];
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction('messages', 'readonly');
      const store = tx.objectStore('messages');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    } catch {
      resolve([]);
    }
  });
}

export async function clearMessagesFromDB() {
  const db = await openDB();
  if (!db) {
    memoryFallback.messages = [];
    return;
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction('messages', 'readwrite');
      const store = tx.objectStore('messages');
      store.clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

// -------------------------------------------------------------
// Premises Store (Grounding Sources)
// -------------------------------------------------------------

export async function savePremisesToDB(premises) {
  if (!Array.isArray(premises)) return;
  const db = await openDB();
  if (!db) {
    memoryFallback.premises = [...premises];
    return;
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction('premises', 'readwrite');
      const store = tx.objectStore('premises');
      store.clear();
      for (const item of premises) {
        store.put(item);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function loadPremisesFromDB() {
  const db = await openDB();
  if (!db) {
    return [...memoryFallback.premises];
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction('premises', 'readonly');
      const store = tx.objectStore('premises');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    } catch {
      resolve([]);
    }
  });
}

// -------------------------------------------------------------
// Claims Cache Store
// -------------------------------------------------------------

export async function cacheClaimEvaluation(hash, claimData) {
  if (!hash || !claimData) return;
  const db = await openDB();
  const record = { hash, ...claimData, timestamp: Date.now() };

  if (!db) {
    memoryFallback.claims_cache[hash] = record;
    return;
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction('claims_cache', 'readwrite');
      const store = tx.objectStore('claims_cache');
      store.put(record);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function getCachedClaimEvaluation(hash) {
  if (!hash) return null;
  const db = await openDB();
  if (!db) {
    return memoryFallback.claims_cache[hash] || null;
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction('claims_cache', 'readonly');
      const store = tx.objectStore('claims_cache');
      const req = store.get(hash);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}
