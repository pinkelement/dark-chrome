// Copyright 2019 Pink Element. All rights reserved.


// execute contentScript.js in all tabs
function injectContentScript() {
  chrome.tabs.query({ url: ['<all_urls>'] }, (tabs) => {
    for (let i = 0; i < tabs.length; i += 1) {
      chrome.tabs.executeScript(tabs[i].id, { file: 'contentScript.js' });
    }
  });
}

// run once to initialize settings
chrome.runtime.onInstalled.addListener((details) => {
  chrome.storage.local.get(['enabled', 'opacity'], (data) => {
    chrome.storage.local.set({
      enabled: data.enabled == null ? true : data.enabled,
      opacity: data.opacity == null ? 0.7 : data.opacity,
    });

    injectContentScript();

    if (details.reason === 'install') {
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
