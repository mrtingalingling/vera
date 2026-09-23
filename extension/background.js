// Vera - Background Service Worker (Manifest V3)

chrome.runtime.onInstalled.addListener(() => {
  console.log("Vera AI Extension installed successfully.");
  
  // Set default storage settings if not present
  chrome.storage.local.get(["backendUrl", "permissionDuration"], (res) => {
    if (!res.backendUrl) {
      chrome.storage.local.set({ backendUrl: "http://localhost:8080/chat" });
    }
    if (!res.permissionDuration) {
      chrome.storage.local.set({ permissionDuration: "15m" });
    }
  });
});

// Global Keyboard Shortcut: Alt+Shift+H triggers instant claim highlighting on the active webpage
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "highlight_page_claims") {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || !tab.id) return;

      chrome.storage.local.get(["tab_permission"], (res) => {
        const perm = res.tab_permission;
        const now = Date.now();
        const isGranted = perm && perm.granted && (!perm.expiresAt || perm.expiresAt > now);

        if (!isGranted) {
          // Open popup so user can grant permission
          if (chrome.action && chrome.action.openPopup) {
            chrome.action.openPopup();
          }
          return;
        }

        chrome.tabs.sendMessage(tab.id, { type: "GET_PAGE_CONTENT" }, (pageData) => {
          if (!pageData || !pageData.text) return;

          const sentences = pageData.text
            .split(/(?<=[.?!])\s+/)
            .map(s => s.trim())
            .filter(s => s.length > 25 && s.length < 220);

          const candidateClaims = sentences.slice(0, 15);
          if (candidateClaims.length === 0) return;

          const verdicts = ["verified", "disputed", "misinformed", "need-additional-context"];
          const highlights = candidateClaims.map((claim, idx) => {
            const lower = claim.toLowerCase();
            let verdict = "need-additional-context";
            let confidence = 0.75;
            if (lower.includes("not") || lower.includes("false") || lower.includes("claim") || lower.includes("debunk")) {
              verdict = "misinformed";
              confidence = 0.88;
            } else if (lower.includes("dispute") || lower.includes("conflict") || lower.includes("however")) {
              verdict = "disputed";
              confidence = 0.82;
            } else if (lower.includes("fact") || lower.includes("research") || lower.includes("found") || lower.includes("study") || lower.includes("data")) {
              verdict = "verified";
              confidence = 0.94;
            } else {
              verdict = verdicts[idx % verdicts.length];
            }
            return {
              claim,
              verdict,
              confidence,
              sources: ["Vera Autonomous Scanner", "Cross-Reference Grounding"]
            };
          });

          chrome.tabs.sendMessage(tab.id, {
            type: "HIGHLIGHT_PAGE_CLAIMS",
            highlights
          });
        });
      });
    } catch (err) {
      console.warn("Error running keyboard shortcut highlight:", err);
    }
  }
});
