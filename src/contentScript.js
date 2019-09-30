/**
 * @license
 * Copyright 2019 Pink Element. All rights reserved.
 */


const TintManager = (() => {
  let tintDiv;

  function setOpacity(enabled, opacity, transition) {
    tintDiv.style.transition = transition ? '0.4s' : '';
    tintDiv.style.opacity = enabled ? opacity : 0;
  }

  function getOpacity() {
    return tintDiv.style.opacity || '0';
  }

  (function initialize() {
    // grab existing tint element, or create new tint element if it doesn't already exist
    tintDiv = document.getElementById('dark-chrome-manager');
    if (tintDiv == null) {
      tintDiv = document.createElement('div');
      tintDiv.id = 'dark-chrome-manager';
      document.documentElement.append(tintDiv);
    }

    // initialize opacity from storage
    chrome.storage.local.get(['enabled', 'opacity'], ({ enabled, opacity }) => {
      setOpacity(enabled == null ? true : enabled, opacity == null ? 0.7 : opacity, false);
    });

    // re-inject tintDiv if needed after page loads
    window.addEventListener('load', () => {
      if (tintDiv.parentElement === null) {
        document.documentElement.append(tintDiv);
      }
    });
  }());

  return { setOpacity, getOpacity };
})();


// listen for updates from popup.js
chrome.runtime.onMessage.addListener(({ active, enabled, opacity }) => {
  TintManager.setOpacity(enabled, opacity, active && (TintManager.getOpacity() === '0') === enabled);
});
