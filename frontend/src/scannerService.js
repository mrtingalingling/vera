/**
 * Vera Active Webpage Scanner Service
 * Manages bi-directional messaging with the extension content script for DOM text extraction and WOT-style claim highlighting.
 */

export async function scanPageContent(chromeContext, fallbackText = '') {
  if (
    typeof chromeContext !== 'undefined' &&
    chromeContext &&
    chromeContext.tabs &&
    chromeContext.tabs.query &&
    chromeContext.tabs.sendMessage
  ) {
    return new Promise((resolve) => {
      chromeContext.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || !tabs[0] || !tabs[0].id) {
          resolve({
            status: 'fallback',
            text: fallbackText,
            warning: 'No active browser tab found.'
          });
          return;
        }

        chromeContext.tabs.sendMessage(tabs[0].id, { action: 'GET_PAGE_CONTENT' }, (response) => {
          if (chromeContext.runtime && chromeContext.runtime.lastError) {
            resolve({
              status: 'fallback',
              text: fallbackText,
              warning: chromeContext.runtime.lastError.message
            });
            return;
          }

          if (response && response.status === 'success' && response.text) {
            resolve({
              status: 'success',
              text: response.text,
              title: response.title || tabs[0].title || 'Active Webpage'
            });
          } else {
            resolve({
              status: 'fallback',
              text: fallbackText,
              warning: response ? response.message : 'Unable to extract webpage content.'
            });
          }
        });
      });
    });
  }

  // Fallback when running in standard standalone web frame
  return {
    status: 'fallback',
    text: fallbackText,
    warning: 'Active webpage scanning is available in the Vera Chrome Extension popup mode.'
  };
}

export async function highlightPageContent(chromeContext, claims = []) {
  if (
    typeof chromeContext !== 'undefined' &&
    chromeContext &&
    chromeContext.tabs &&
    chromeContext.tabs.query &&
    chromeContext.tabs.sendMessage &&
    claims.length > 0
  ) {
    return new Promise((resolve) => {
      chromeContext.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || !tabs[0] || !tabs[0].id) {
          resolve({ status: 'error', count: 0 });
          return;
        }

        chromeContext.tabs.sendMessage(
          tabs[0].id,
          { action: 'HIGHLIGHT_PAGE_CLAIMS', claims },
          (response) => {
            if (response && response.status === 'success') {
              resolve({ status: 'success', count: response.count || 0 });
            } else {
              resolve({ status: 'error', count: 0 });
            }
          }
        );
      });
    });
  }

  return { status: 'noop', count: 0 };
}
