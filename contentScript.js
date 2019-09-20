// Copyright 2019 Pink Element. All rights reserved.

'use strict';

// grab existing tint element, or create new tint element if it doesn't already exist
var tint = document.getElementById("Rej2G25SC4");
if (tint == null) {
  tint = document.createElement("div");
  tint.id = "Rej2G25SC4"
  tint.style = "position: fixed;top: 0;left: 0;width: 100%;height: 100%;z-index: 2147483647;background-color: black;pointer-events:none;";
  tint.class = "citdOverlay";
  document.documentElement.append(tint);
}

// initialize tint settings
chrome.storage.local.get(['enabled', 'opacity'], function (data) {
  tint.style.opacity = data.enabled ? data.opacity : 0;
});

// listen for updates
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  tint.style.transition = request.active && (tint.style.opacity == 0) == request.enabled ? "0.4s" : "0s";
  tint.style.opacity = request.enabled ? request.opacity : 0;
});