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

// Popups
const overlay = document.getElementById('overlay');
const openButtons = document.querySelectorAll('.open-popup');
const closeButtons = document.querySelectorAll('.popup .close');

closeButtons.forEach(btn =>
    btn.addEventListener('click', () => overlay.classList.remove('open'))
);

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

// Slider logic (step by full card)
const track = document.getElementById('sliderTrack');
const cards = track?.querySelectorAll('.card') || [];
let currentIndex = 0;

function visibleCount() {
  return window.innerWidth >= 768 ? 3 : 1;
}

function cardStepWidth() {
  return cards[0] ? cards[0].offsetWidth + 24 : 0;
}

function scrollToCardGroup(index) {
  if (!track) return;
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
  if (track) scrollToCardGroup(currentIndex);
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
