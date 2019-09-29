// Copyright 2019 Pink Element. All rights reserved.


// execute contentScript.js in all tabs
function injectContentScript() {
  chrome.tabs.query({ url: ['*://*/*'] }, (tabs) => {
    tabs.forEach((tab) => {
      if (!tab.url.startsWith('https://chrome.google.com/webstore')) {
        chrome.tabs.insertCSS(tab.id, { file: 'contentScript.css' });
        chrome.tabs.executeScript(tab.id, { file: 'contentScript.js' });
      }
    });
  });
}

// run once to initialize settings
chrome.runtime.onInstalled.addListener(({ reason }) => {
  chrome.storage.local.get(['enabled', 'opacity'], ({ enabled, opacity }) => {
    chrome.storage.local.set({
      enabled: enabled == null ? true : enabled,
      opacity: opacity == null ? 0.7 : opacity,
    }, () => injectContentScript());

    if (reason === 'install') {
      // TODO: direct to landing page
    }
  });
});

// run when extension is enabled
chrome.management.onEnabled.addListener((info) => {
  chrome.management.getSelf((result) => {
    if (result.id === info.id) {
      injectContentScript();
    }
  });
});
