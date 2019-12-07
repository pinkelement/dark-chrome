/**
 * @license
 * Copyright 2019 Pink Element. All rights reserved.
 */


const slider = document.getElementById('slider');


const PopoverManager = (() => {
  const tryMe = document.getElementById('try-me');
  const button = document.querySelector('#try-me button');

  function updatePosition() {
    const rect = slider.getBoundingClientRect();
    document.getElementById('try-me').style.right = `${(1 - (slider.value - slider.min) / (slider.max - slider.min)) * (rect.width - 24) + 12 - 20}px`;
  }

  function show() {
    updatePosition();
    setTimeout(() => {
      tryMe.classList.remove('v-hidden');
      tryMe.style.transition = '0.4s';
      tryMe.style.opacity = 1;
    }, 100);
  }

  (function initialize() {
    setTimeout(show, 900);
    window.addEventListener('resize', updatePosition);

    button.onclick = () => {
      tryMe.hidden = true;
      setTimeout(() => {
        window.removeEventListener('resize', updatePosition);
      }, 400);
    };
  }());

  return { updatePosition };
})();


const UIManager = (() => {
  let tintDiv;

  function setOpacity(opacity) {
    tintDiv.style.opacity = opacity;
    PopoverManager.updatePosition();
  }

  function updateSlider(newValue) {
    slider.value = newValue;
    PopoverManager.updatePosition();
  }

  (function initialize() {
    tintDiv = document.getElementById('dark-chrome-manager');
    if (tintDiv == null) {
      tintDiv = document.createElement('div');
      tintDiv.id = 'dark-chrome-manager';
      document.documentElement.append(tintDiv);

      setOpacity(0.7);
    } else {
      updateSlider(tintDiv.style.opacity);
    }

    // slider controls
    slider.oninput = () => {
      UIManager.setOpacity(slider.value);
    };

    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.attributeName === 'style') {
          UIManager.updateSlider(tintDiv.style.opacity);
        }
      });
    });

    observer.observe(tintDiv, { attributes: true });
  }());

  return { setOpacity, updateSlider };
})();
