// Copyright 2019 Pink Element. All rights reserved.


const onoff = document.getElementById('onoff');
const onoffslider = document.getElementById('onoffslider');
const sliderbox = document.getElementById('sliderbox');
const slider = document.getElementById('slider');
const tint = document.getElementById('tint');
const version = document.getElementById('version');

version.textContent = `v${chrome.runtime.getManifest().version}`;

// single function to update all UI elements
function updateUI(enabled, opacity) {
  tint.style.transition = (tint.style.opacity === 0) === enabled ? '0.4s' : '0s';
  tint.style.opacity = enabled ? opacity : 0;

  sliderbox.style.height = enabled ? '50px' : 0;
  slider.disabled = !enabled;
  onoff.checked = enabled;
  slider.value = opacity;
}

// sync settings with every tab, and other popups
function sendMessage(enabled, opacity) {
  chrome.runtime.sendMessage({ enabled, opacity });
  chrome.tabs.query({ url: '<all_urls>' }, (tabs) => {
    for (let i = 0; i < tabs.length; i += 1) {
      chrome.tabs.sendMessage(tabs[i].id, { active: tabs[i].active, enabled, opacity });
    }
  });
}

// retrieve saved settings, and initialize UI
chrome.storage.local.get(['enabled', 'opacity'], (data) => {
  updateUI(data.enabled, data.opacity);

  sliderbox.style.display = '';
  onoffslider.style.display = '';
});

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

  updateUI(enabled, opacity);
  sendMessage(enabled, opacity);

  chrome.storage.local.set({ enabled });
};

// slider controls
slider.oninput = () => {
  const enabled = onoff.checked;
  const opacity = slider.value;

  updateUI(enabled, opacity);
  sendMessage(enabled, opacity);
};

// wait until user has finished fiddling with slider before saving settings
slider.onmouseup = () => {
  chrome.storage.local.set({ opacity: slider.value });
};

// listen for updates from other popups
chrome.runtime.onMessage.addListener(
  (request) => {
    updateUI(request.enabled, request.opacity);
  },
);
