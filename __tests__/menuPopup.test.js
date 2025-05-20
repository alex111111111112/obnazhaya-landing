const { JSDOM } = require('jsdom');

function loadScripts() {
  jest.resetModules();
  require('../js/scripts.js');
}

describe('menu and popup logic', () => {
  test('burger click opens fullscreen menu', () => {
    const dom = new JSDOM(`
      <div id="burger"></div>
      <nav id="fullscreenMenu" class="fullscreen-menu"></nav>
    `);
    global.document = dom.window.document;
    global.window = dom.window;
    loadScripts();

    const burger = document.getElementById('burger');
    const menu = document.getElementById('fullscreenMenu');

    burger.click();
    expect(menu.classList.contains('open')).toBe(true);
  });

  test('popup opens and closes via buttons', () => {
    const dom = new JSDOM(`
      <button class="open-popup" data-id="event1"></button>
      <div id="overlay" class="popup-overlay">
        <div id="popup-event1" class="popup">
          <button class="close"></button>
        </div>
      </div>
    `);
    global.document = dom.window.document;
    global.window = dom.window;
    loadScripts();

    const openBtn = document.querySelector('.open-popup');
    const overlay = document.getElementById('overlay');
    const closeBtn = document.querySelector('.popup .close');

    openBtn.click();
    expect(overlay.classList.contains('open')).toBe(true);

    closeBtn.click();
    expect(overlay.classList.contains('open')).toBe(false);
  });
});
