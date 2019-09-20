// Copyright 2019 Pink Element. All rights reserved.

'use strict';

// execute contentScript.js in all tabs
let injectContentScript = function () {
  chrome.tabs.query({ url: ["<all_urls>"] }, function (tabs) {
    for (var i = 0; i < tabs.length; i++) {
      chrome.tabs.executeScript(tabs[i].id, { file: 'contentScript.js' });
    }
  });
}

// run once to initialize settings
chrome.runtime.onInstalled.addListener(function (details) {
  chrome.storage.local.get(['enabled', 'opacity'], function (data) {
    chrome.storage.local.set({
      enabled: data.enabled == null ? true : data.enabled,
      opacity: data.opacity == null ? .7 : data.opacity
    });

    injectContentScript();

    if (details.reason == "install") {
      // TODO: direct to landing page
    }
  });
});

// run when extension is enabled
chrome.management.onEnabled.addListener(function (info) {
  chrome.management.getSelf(function (result) {
    if (result.id == info.id) {
      injectContentScript();
    }
  })
});