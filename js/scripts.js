const burger = document.getElementById('burger');
const fullMenu = document.getElementById('fullscreenMenu');
burger.addEventListener('click', () => fullMenu.classList.add('open'));
fullMenu.addEventListener('click', (e) => {
  if (e.target.tagName === 'A' || e.target === fullMenu) {
    fullMenu.classList.remove('open');
  }
});

// Popups
const overlay = document.getElementById('overlay');
const openButtons = document.querySelectorAll('.open-popup');
const closeButtons = [];

openButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.id;
    document.querySelectorAll('.popup').forEach(p => p.classList.remove('open'));
    const popup = document.getElementById('popup-' + id);
    if (popup) {
      popup.classList.add('open');
      overlay.classList.add('open');
    }
  });
});

// dynamic add close handlers once popups exist
const observer = new MutationObserver(mutations => {
  mutations.forEach(m => {
    m.addedNodes.forEach(node => {
      if (node.classList && node.classList.contains('popup')) {
        const closeBtn = node.querySelector('.close');
        if (closeBtn) closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
      }
    });
  });
});
observer.observe(document.body, {childList:true, subtree:true});
overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });

// Contact form
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Спасибо, сообщение отправлено!');
  e.target.reset();
});
