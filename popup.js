// Copyright 2019 Pink Element. All rights reserved.

'use strict';

let onoff = document.getElementById("onoff");
let onoffslider = document.getElementById("onoffslider");
let sliderbox = document.getElementById("sliderbox");
let slider = document.getElementById("slider");
let tint = document.getElementById("tint");

// single function to update all UI elements
let updateUI = function (enabled, opacity) {
  tint.style.transition = (tint.style.opacity == 0) == enabled ? "0.4s" : "0s";
  tint.style.opacity = enabled ? opacity : 0;

  sliderbox.style.height = enabled ? "50px" : 0;
  slider.disabled = !enabled;
  onoff.checked = enabled;
  slider.value = opacity;
}

// sync settings with every tab, and other popups
let sendMessage = function (enabled, opacity) {
  chrome.runtime.sendMessage({ enabled, opacity });
  chrome.tabs.query({ url: "<all_urls>" }, function (tabs) {
    for (var i = 0; i < tabs.length; i++) {
      chrome.tabs.sendMessage(tabs[i].id, { active: tabs[i].active, enabled, opacity });
    }
  });
}

// retrieve saved settings, and initialize UI
chrome.storage.local.get(['enabled', 'opacity'], function (data) {
  updateUI(data.enabled, data.opacity);

  sliderbox.style.display = '';
  onoffslider.style.display = '';
});

// onoff controls
onoff.oninput = function () {
  let enabled = this.checked;
  let opacity = slider.value;

  let iconPrefix = enabled ? 'icon' : 'iconOff';
  chrome.browserAction.setIcon({
    path: {
      16: `images/${iconPrefix}-16.png`,
      32: `images/${iconPrefix}-32.png`,
      48: `images/${iconPrefix}-48.png`,
      128: `images/${iconPrefix}-128.png`
    }
  });

  updateUI(enabled, opacity);
  sendMessage(enabled, opacity);

  chrome.storage.local.set({ enabled });
}

// slider controls
slider.oninput = function () {
  let enabled = onoff.checked;
  let opacity = this.value;

  updateUI(enabled, opacity);
  sendMessage(enabled, opacity);
}

// wait until user has finished fiddling with slider before saving settings
slider.onmouseup = function () {
  chrome.storage.local.set({ opacity: this.value });
}

// listen for updates from other popups
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    updateUI(request.enabled, request.opacity);
  }
);