const burger = document.getElementById('burger');
const fullMenu = document.getElementById('fullscreenMenu');
burger.addEventListener('click', () => {
  fullMenu.classList.toggle('open');
});
fullMenu.addEventListener('click', (e) => {
  if (e.target.tagName === 'A' || e.target === fullMenu) {
    fullMenu.classList.remove('open');
  }
});

// Popups with focus management
const overlay = document.getElementById('overlay');
const openButtons = document.querySelectorAll('.open-popup');
const closeButtons = document.querySelectorAll('.popup .close');
const focusable = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
let lastFocused = null;

function trapTab(e) {
  const popup = document.querySelector('.popup.open');
  if (!popup) return;
  const nodes = Array.from(popup.querySelectorAll(focusable));
  if (!nodes.length) return;
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
    e.preventDefault();
    (e.shiftKey ? last : first).focus();
  }
}

function openModal(id) {
  document.querySelectorAll('.popup').forEach(p => p.classList.remove('open'));
  const popup = document.getElementById('popup-' + id);
  if (popup) {
    lastFocused = document.activeElement;
    overlay.classList.add('open');
    popup.classList.add('open');
    document.querySelectorAll('body > :not(#overlay)').forEach(el => el.setAttribute('aria-hidden', 'true'));
    const target = popup.querySelector(focusable) || popup;
    target.focus();
  }
}

function closeModal() {
  overlay.classList.remove('open');
  document.querySelectorAll('.popup').forEach(p => p.classList.remove('open'));
  document.querySelectorAll('body > :not(#overlay)').forEach(el => el.removeAttribute('aria-hidden'));
  if (lastFocused) lastFocused.focus();
}

closeButtons.forEach(btn => btn.addEventListener('click', closeModal));
openButtons.forEach(btn => btn.addEventListener('click', () => openModal(btn.dataset.id)));
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  if (e.key === 'Tab' && overlay.classList.contains('open')) trapTab(e);
});

// Contact form
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Спасибо, сообщение отправлено!');
  e.target.reset();
});

// Slider logic (step by full card)
const track = document.getElementById('sliderTrack');
const cards = track?.querySelectorAll('.card') || [];
let currentIndex = 0;

function visibleCount() {
  return window.innerWidth >= 768 ? 3 : 1;
}

function cardStepWidth() {
  return cards[0].offsetWidth + 24;
}

function scrollToCardGroup(index) {
  const offset = cardStepWidth() * visibleCount() * index;
  track.scrollTo({ left: offset, behavior: 'smooth' });
}

function maxIndex() {
  return Math.ceil(cards.length / visibleCount()) - 1;
}

function updateDots(index) {
  const dots = document.querySelectorAll('#sliderDots .dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

document.querySelector('.nav.next')?.addEventListener('click', () => {
  if (currentIndex < maxIndex()) currentIndex++;
  scrollToCardGroup(currentIndex);
  updateDots(currentIndex);
});

document.querySelector('.nav.prev')?.addEventListener('click', () => {
  if (currentIndex > 0) currentIndex--;
  scrollToCardGroup(currentIndex);
  updateDots(currentIndex);
});

window.addEventListener('resize', () => {
  scrollToCardGroup(currentIndex);
});


// Slide-in hint when afisha enters view
const afisha = document.getElementById('sliderTrack');
const hintObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    afisha.scrollBy({ left: 20, behavior: 'smooth' });
    setTimeout(() => afisha.scrollBy({ left: -20, behavior: 'smooth' }), 400);
    hintObserver.disconnect();
  }
}, { threshold: 0.6 });
if (afisha) hintObserver.observe(afisha);

// Активная точка при прокрутке карточек на мобильном
const mobileTrack = document.querySelector('.cards');
if (mobileTrack) {
  mobileTrack.addEventListener('scroll', () => {
    const cards = Array.from(mobileTrack.querySelectorAll('.card'));
    const scrollLeft = mobileTrack.scrollLeft;
    const viewWidth = mobileTrack.offsetWidth;

    const activeIndex = Math.round(scrollLeft / viewWidth);

    cards.forEach((card, i) => {
      const dots = card.querySelectorAll('.dot');
      dots.forEach((dot, d) => {
        dot.classList.toggle('active', d === activeIndex);
      });
    });
  });
}

// Favorite buttons
const favButtons = document.querySelectorAll('.fav-btn');
const storedFavs = JSON.parse(localStorage.getItem('favs') || '[]');
favButtons.forEach(btn => {
  const card = btn.closest('.card');
  const id = card?.dataset.id;
  if (!id) return;
  if (storedFavs.includes(id)) btn.classList.add('active');
  btn.addEventListener('click', () => {
    let favs = JSON.parse(localStorage.getItem('favs') || '[]');
    if (favs.includes(id)) {
      favs = favs.filter(v => v !== id);
      btn.classList.remove('active');
      btn.setAttribute('aria-label', 'Добавить в избранное');
    } else {
      favs.push(id);
      btn.classList.add('active');
      btn.setAttribute('aria-label', 'Убрать из избранного');
    }
    localStorage.setItem('favs', JSON.stringify(favs));
  });
});
