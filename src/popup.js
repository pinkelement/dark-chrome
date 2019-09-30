/**
 * @license
 * Copyright 2019 Pink Element. All rights reserved.
 */


const onoff = document.getElementById('onoff');
const slider = document.getElementById('slider');


const UIManager = (() => {
  const tint = document.getElementById('tint');
  const onoffslider = document.getElementById('onoffslider');
  const sliderbox = document.getElementById('sliderbox');

  function update(enabled, opacity) {
    tint.style.transition = (tint.style.opacity === '0') === enabled ? '0.4s' : '';
    tint.style.opacity = enabled ? opacity : 0;

    sliderbox.style.height = enabled ? '50px' : 0;
    slider.disabled = !enabled;
    onoff.checked = enabled;
    slider.value = opacity;
  }

  (function initialize() {
    // set version number from manifest
    const version = document.getElementById('version');
    version.textContent = `v${chrome.runtime.getManifest().version}`;

    // retrieve saved settings, and initialize UI
    chrome.storage.local.get(['enabled', 'opacity'], ({ enabled, opacity }) => {
      update(enabled, opacity);

      // show animated widgets after initializing to skip initial animation
      sliderbox.style.display = '';
      onoffslider.style.display = '';
    });
  }());

  return { update };
})();


// sync settings with every tab, and other popups
function sendMessage(enabled, opacity) {
  chrome.runtime.sendMessage({ enabled, opacity });
  chrome.tabs.query({ url: '<all_urls>' }, (tabs) => {
    tabs.forEach((tab) => chrome.tabs.sendMessage(tab.id,
      { active: tab.active, enabled, opacity }));
  });
}

// onoff controls
onoff.oninput = () => {
  const enabled = onoff.checked;
  const opacity = slider.value;

  const iconPrefix = enabled ? 'icon' : 'iconOff';
  chrome.browserAction.setIcon({
    path: {
      16: `images/${iconPrefix}-16.png`,
      32: `images/${iconPrefix}-32.png`,
      48: `images/${iconPrefix}-48.png`,
      128: `images/${iconPrefix}-128.png`,
    },
  });

  UIManager.update(enabled, opacity);
  sendMessage(enabled, opacity);

  chrome.storage.local.set({ enabled });
};

// slider controls
slider.oninput = () => {
  const enabled = onoff.checked;
  const opacity = slider.value;

  UIManager.update(enabled, opacity);
  sendMessage(enabled, opacity);
};

// wait until user has finished fiddling with slider before saving settings
slider.onmouseup = () => { chrome.storage.local.set({ opacity: slider.value }); };

// listen for updates from other popups
chrome.runtime.onMessage.addListener(({ enabled, opacity }) => UIManager.update(enabled, opacity));
