const TOTAL = 59;
if (window.self !== window.top) document.documentElement.classList.add('is-embedded');

const sections = [
  [1, 'Cover'], [3, 'Contents'], [4, 'I. Vision'], [5, 'II. Material Exploration'],
  [10, 'III. Image Board'], [14, 'IV. Early Design Experiments'],
  [16, 'V. Mechanical Expansion'], [18, 'VI. Spatial Concept'],
  [24, 'VII. Digital Development'], [32, 'VIII. Rough Concept'],
  [34, 'IX. Fabrication Strategy'], [38, 'X. Printing Process'],
  [40, 'XI. Final Assembly'], [45, 'XII. Cherry on Top'], [46, 'Conclusion'],
];

const $ = selector => document.querySelector(selector);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/* Collapsed project index */
const indexTrigger = $('#indexTrigger');
const siteIndex = $('#siteIndex');
const indexClose = $('#indexClose');
const indexOverlay = $('#indexOverlay');
const pageMain = document.querySelector('main');
let indexReturnFocus = null;
let overlayTimer = 0;

function openIndex() {
  clearTimeout(overlayTimer);
  indexReturnFocus = document.activeElement;
  indexOverlay.hidden = false;
  requestAnimationFrame(() => {
    siteIndex.classList.add('open');
    indexOverlay.classList.add('visible');
  });
  document.body.classList.add('index-open');
  indexTrigger.setAttribute('aria-expanded', 'true');
  siteIndex.setAttribute('aria-hidden', 'false');
  pageMain.inert = true;
  indexClose.focus();
}

function closeIndex(restoreFocus = true) {
  siteIndex.classList.remove('open');
  indexOverlay.classList.remove('visible');
  document.body.classList.remove('index-open');
  indexTrigger.setAttribute('aria-expanded', 'false');
  siteIndex.setAttribute('aria-hidden', 'true');
  pageMain.inert = false;
  overlayTimer = setTimeout(() => { indexOverlay.hidden = true; }, 300);
  if (restoreFocus) indexReturnFocus?.focus();
}

indexTrigger.addEventListener('click', openIndex);
indexClose.addEventListener('click', () => closeIndex());
indexOverlay.addEventListener('click', () => closeIndex());
siteIndex.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeIndex(false)));
document.addEventListener('keydown', event => {
  if (!siteIndex.classList.contains('open')) return;
  if (event.key === 'Escape') { event.preventDefault(); closeIndex(); return; }
  if (event.key !== 'Tab') return;
  const focusable = [...siteIndex.querySelectorAll('a,button')];
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});

/* Full-bleed gallery */
const showcase = $('.showcase');
const filmstrip = $('#filmstrip');
const gallerySlides = [...document.querySelectorAll('.gallery-slide')];
const galleryCurrent = $('#galleryCurrent');
const galleryToggleCurrent = $('#galleryToggleCurrent');
const thumbnails = [...document.querySelectorAll('.thumbnail')];
const thumbnailRail = $('#thumbnailRail');
const galleryDock = $('#galleryDock');
const galleryDockToggle = $('#galleryDockToggle');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const AUTOPLAY_DELAY = 4500;
let galleryIndex = 0;
let galleryDrag = null;
let galleryFrame = 0;
let autoplayTimer = 0;
let galleryIsVisible = true;
let galleryDockPinned = false;
let galleryDockCloseTimer = 0;

function scheduleAutoplay() {
  clearTimeout(autoplayTimer);
  if (!galleryIsVisible || document.hidden || reducedMotion.matches) return;
  autoplayTimer = setTimeout(() => {
    setGalleryIndex((galleryIndex + 1) % gallerySlides.length, 'smooth', false);
    scheduleAutoplay();
  }, AUTOPLAY_DELAY);
}

function setGalleryIndex(index, behavior = 'smooth', resetAutoplay = true) {
  galleryIndex = clamp(index, 0, gallerySlides.length - 1);
  filmstrip.scrollTo({ left: galleryIndex * filmstrip.clientWidth, behavior });
  updateGalleryUI();
  if (resetAutoplay) scheduleAutoplay();
}

function updateGalleryUI() {
  galleryCurrent.textContent = String(galleryIndex + 1).padStart(2, '0');
  galleryToggleCurrent.textContent = String(galleryIndex + 1).padStart(2, '0');
  showcase.classList.toggle('has-scrolled', galleryIndex > 0);
  $('.gallery-prev').disabled = galleryIndex === 0;
  $('.gallery-next').disabled = galleryIndex === gallerySlides.length - 1;
  thumbnails.forEach((thumbnail, index) => {
    const active = index === galleryIndex;
    thumbnail.classList.toggle('active', active);
    if (active) thumbnail.setAttribute('aria-current', 'true');
    else thumbnail.removeAttribute('aria-current');
  });
  const activeThumbnail = thumbnails[galleryIndex];
  if (activeThumbnail) {
    const target = activeThumbnail.offsetLeft - (thumbnailRail.clientWidth - activeThumbnail.offsetWidth) / 2;
    thumbnailRail.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }
}

function setGalleryDockOpen(isOpen) {
  clearTimeout(galleryDockCloseTimer);
  showcase.classList.toggle('gallery-dock-open', isOpen);
  galleryDockToggle.setAttribute('aria-expanded', String(isOpen));
  galleryDock.setAttribute('aria-hidden', String(!isOpen));
  galleryDock.inert = !isOpen;
  if (isOpen) requestAnimationFrame(updateGalleryUI);
}

function scheduleGalleryDockClose() {
  clearTimeout(galleryDockCloseTimer);
  if (galleryDockPinned) return;
  galleryDockCloseTimer = setTimeout(() => setGalleryDockOpen(false), 180);
}

function previewGalleryDock() {
  clearTimeout(galleryDockCloseTimer);
  setGalleryDockOpen(true);
}

galleryDockToggle.addEventListener('pointerenter', previewGalleryDock);
galleryDockToggle.addEventListener('pointerleave', scheduleGalleryDockClose);
galleryDock.addEventListener('pointerenter', previewGalleryDock);
galleryDock.addEventListener('pointerleave', scheduleGalleryDockClose);

galleryDockToggle.addEventListener('click', () => {
  galleryDockPinned = !galleryDockPinned;
  setGalleryDockOpen(galleryDockPinned);
});

filmstrip.addEventListener('scroll', () => {
  cancelAnimationFrame(galleryFrame);
  galleryFrame = requestAnimationFrame(() => {
    galleryIndex = clamp(Math.round(filmstrip.scrollLeft / filmstrip.clientWidth), 0, gallerySlides.length - 1);
    updateGalleryUI();
    scheduleAutoplay();
  });
}, { passive: true });

filmstrip.addEventListener('pointerdown', event => {
  galleryDockPinned = false;
  setGalleryDockOpen(false);
  clearTimeout(autoplayTimer);
  if (event.pointerType === 'touch') return;
  galleryDrag = { pointerId: event.pointerId, startX: event.clientX, startScroll: filmstrip.scrollLeft, moved: false };
  filmstrip.classList.add('dragging');
  filmstrip.setPointerCapture(event.pointerId);
});

filmstrip.addEventListener('pointermove', event => {
  if (!galleryDrag || event.pointerId !== galleryDrag.pointerId) return;
  const distance = event.clientX - galleryDrag.startX;
  if (Math.abs(distance) > 4) galleryDrag.moved = true;
  filmstrip.scrollLeft = galleryDrag.startScroll - distance;
});

function endGalleryDrag(event) {
  if (!galleryDrag || event.pointerId !== galleryDrag.pointerId) {
    scheduleAutoplay();
    return;
  }
  const destination = Math.round(filmstrip.scrollLeft / filmstrip.clientWidth);
  galleryDrag = null;
  filmstrip.classList.remove('dragging');
  setGalleryIndex(destination);
}

filmstrip.addEventListener('pointerup', endGalleryDrag);
filmstrip.addEventListener('pointercancel', endGalleryDrag);
$('.gallery-prev').addEventListener('click', () => setGalleryIndex(galleryIndex - 1));
$('.gallery-next').addEventListener('click', () => setGalleryIndex(galleryIndex + 1));
thumbnails.forEach(thumbnail => thumbnail.addEventListener('click', () => {
  setGalleryIndex(Number(thumbnail.dataset.galleryIndex));
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && showcase.classList.contains('gallery-dock-open')) {
    galleryDockPinned = false;
    setGalleryDockOpen(false);
    galleryDockToggle.focus();
  }
});
filmstrip.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') { event.preventDefault(); setGalleryIndex(galleryIndex + 1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); setGalleryIndex(galleryIndex - 1); }
});

document.addEventListener('visibilitychange', scheduleAutoplay);
reducedMotion.addEventListener?.('change', scheduleAutoplay);
new IntersectionObserver(entries => {
  galleryIsVisible = entries[0]?.isIntersecting ?? true;
  scheduleAutoplay();
}, { threshold: .4 }).observe(showcase);

const showcaseCopy = $('.showcase-copy');
setTimeout(() => {
  showcase.classList.add('hero-copy-hidden');
  showcaseCopy.setAttribute('aria-hidden', 'true');
  showcaseCopy.querySelectorAll('a,button').forEach(control => { control.tabIndex = -1; });
}, 2000);

/* On-demand publication reader */
const readerSection = $('#reader');
const readerOpeners = [...document.querySelectorAll('.reader-opener')];
const readerClose = $('#readerClose');
const fullscreenButton = $('#fullscreen');

function setReaderOpen(isOpen, scrollToReader = false) {
  readerSection.hidden = !isOpen;
  readerOpeners.forEach(opener => opener.setAttribute('aria-expanded', String(isOpen)));
  fullscreenButton.disabled = !isOpen;
  if (isOpen) {
    render();
    if (scrollToReader) requestAnimationFrame(() => readerSection.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' }));
  }
}

readerOpeners.forEach(opener => opener.addEventListener('click', () => setReaderOpen(true, true)));
readerClose.addEventListener('click', () => {
  if (document.fullscreenElement) document.exitFullscreen();
  setReaderOpen(false);
  document.querySelector('.publication-lead').scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
  readerOpeners[0]?.focus({ preventScroll: true });
});

/* Collapsed availability */
const availability = $('#availability');
const availabilityToggle = $('#availabilityToggle');
const availabilityPanel = $('#availabilityPanel');
const availabilityActionLabel = $('#availabilityActionLabel');
const heroEnquire = $('#heroEnquire');

function setAvailabilityOpen(isOpen, scrollToSection = false) {
  availability.classList.toggle('is-open', isOpen);
  availabilityPanel.hidden = !isOpen;
  availabilityToggle.setAttribute('aria-expanded', String(isOpen));
  availabilityActionLabel.textContent = isOpen ? 'Close details' : 'View details';
  if (scrollToSection) requestAnimationFrame(() => availability.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' }));
}

availabilityToggle.addEventListener('click', () => setAvailabilityOpen(!availability.classList.contains('is-open')));
heroEnquire.addEventListener('click', event => {
  event.preventDefault();
  setAvailabilityOpen(true, true);
});

/* Private enquiry delivery */
const enquiryForm = $('#enquiryForm');
const enquiryStatus = $('#enquiryStatus');
const enquirySubmit = enquiryForm.querySelector('button[type="submit"]');
const enquirySubmitLabel = enquirySubmit.textContent;
const FORM_ENDPOINT_PLACEHOLDER = 'YOUR_FORM_ID';

function setEnquiryStatus(message = '', state = '') {
  enquiryStatus.textContent = message;
  if (state) enquiryStatus.dataset.state = state;
  else delete enquiryStatus.dataset.state;
}

enquiryForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!enquiryForm.reportValidity()) return;

  const endpoint = enquiryForm.action;
  if (endpoint.includes(FORM_ENDPOINT_PLACEHOLDER)) {
    setEnquiryStatus('Email delivery is awaiting its Formspree Form ID.', 'error');
    return;
  }

  enquirySubmit.disabled = true;
  enquirySubmit.textContent = 'Sending enquiry…';
  enquiryForm.setAttribute('aria-busy', 'true');
  setEnquiryStatus('Sending your private enquiry…');

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: new FormData(enquiryForm),
      headers: { Accept: 'application/json' },
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const serviceMessage = payload.errors?.map(error => error.message).filter(Boolean).join(' ');
      throw new Error(serviceMessage || 'The enquiry service could not accept this message.');
    }

    enquiryForm.reset();
    setEnquiryStatus('Thank you. Your private enquiry has been sent to the designers.', 'success');
  } catch (error) {
    console.error('Enquiry delivery failed', error);
    setEnquiryStatus('The enquiry could not be sent. Please check your connection and try again.', 'error');
  } finally {
    enquirySubmit.disabled = false;
    enquirySubmit.textContent = enquirySubmitLabel;
    enquiryForm.removeAttribute('aria-busy');
  }
});

enquiryForm.addEventListener('input', () => {
  if (!enquiryForm.hasAttribute('aria-busy') && enquiryStatus.dataset.state === 'error') setEnquiryStatus();
});

/* Draggable publication */
const reader = {
  book: $('.book'),
  left: $('#leftPage'),
  right: $('#rightPage'),
  sheet: $('.drag-sheet'),
  front: $('#dragFront'),
  back: $('#dragBack'),
  current: $('#currentPage'),
  label: $('#sectionLabel'),
  scrubber: $('#scrubber'),
};

let page = 1;
let pageDrag = null;
const pageUrl = number => `pages/page-${String(number).padStart(2, '0')}.webp?v=privacy-bw-selection-0818`;
const isMobile = () => matchMedia('(max-width: 760px)').matches;
const sectionFor = number => [...sections].reverse().find(([start]) => number >= start)?.[1] || 'Publication';

function spread() {
  if (isMobile()) return { left: null, right: page };
  const left = page % 2 === 0 ? page : page - 1;
  return { left: left > 0 ? left : null, right: left + 1 <= TOTAL ? left + 1 : null };
}

function setPageImage(element, number) {
  if (!number) {
    element.removeAttribute('src');
    element.alt = '';
    return;
  }
  element.src = pageUrl(number);
  element.alt = `Publication page ${number}`;
}

function preload(number) {
  [number - 2, number - 1, number, number + 1, number + 2]
    .filter(candidate => candidate > 0 && candidate <= TOTAL)
    .forEach(candidate => { const image = new Image(); image.src = pageUrl(candidate); });
}

function render() {
  const currentSpread = spread();
  setPageImage(reader.left, currentSpread.left);
  setPageImage(reader.right, currentSpread.right);
  reader.current.textContent = String(page).padStart(2, '0');
  reader.label.textContent = sectionFor(page);
  reader.scrubber.value = page;
  preload(page);
}

function nextPage(direction) {
  return clamp(page + direction * (isMobile() ? 1 : 2), 1, TOTAL);
}

function updatePageDrag(event, knownRect) {
  if (!pageDrag) return;
  const rect = knownRect || reader.book.getBoundingClientRect();
  const distance = isMobile() ? rect.width : rect.width / 2;
  pageDrag.progress = clamp(
    pageDrag.direction > 0
      ? (pageDrag.startX - event.clientX) / distance
      : (event.clientX - pageDrag.startX) / distance,
    0,
    1,
  );
  reader.book.style.setProperty('--drag-angle', `${pageDrag.direction * pageDrag.progress * -180}deg`);
}

function startPageDrag(direction, event) {
  const target = nextPage(direction);
  if (target === page) return;
  event.preventDefault();
  const rect = reader.book.getBoundingClientRect();
  const currentSpread = spread();
  pageDrag = { direction, startX: event.clientX, progress: 0, target, settling: false };
  reader.book.classList.add('dragging');
  reader.sheet.className = `drag-sheet active ${direction > 0 ? 'next' : 'prev'}`;
  reader.sheet.style.removeProperty('transition');

  if (direction > 0) {
    setPageImage(reader.front, currentSpread.right);
    setPageImage(reader.back, isMobile() ? target : target - 1);
    setPageImage(reader.right, target);
  } else {
    setPageImage(reader.front, isMobile() ? currentSpread.right : currentSpread.left);
    setPageImage(reader.back, target);
    if (isMobile()) setPageImage(reader.right, target);
    else setPageImage(reader.left, target > 1 ? target - 1 : null);
  }

  if (Number.isInteger(event.pointerId) && event.pointerId >= 0) {
    reader.book.setPointerCapture?.(event.pointerId);
  }
  updatePageDrag(event, rect);
}

function endPageDrag() {
  if (!pageDrag || pageDrag.settling) return;
  pageDrag.settling = true;
  const complete = pageDrag.progress > .24;
  const { target, direction } = pageDrag;
  reader.sheet.classList.add('settling');
  reader.book.style.setProperty('--drag-angle', `${complete ? direction * -180 : 0}deg`);
  setTimeout(() => {
    if (complete) page = target;
    reader.sheet.className = 'drag-sheet';
    reader.book.classList.remove('dragging');
    reader.book.style.setProperty('--drag-angle', '0deg');
    pageDrag = null;
    render();
  }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 290);
}

$('.hit.next').addEventListener('pointerdown', event => startPageDrag(1, event));
$('.hit.prev').addEventListener('pointerdown', event => startPageDrag(-1, event));
reader.book.addEventListener('pointermove', event => updatePageDrag(event));
reader.book.addEventListener('pointerup', endPageDrag);
reader.book.addEventListener('pointercancel', endPageDrag);
reader.book.addEventListener('lostpointercapture', endPageDrag);

function go(direction) {
  if (pageDrag) return;
  const target = nextPage(direction);
  if (target === page) return;
  const rect = reader.book.getBoundingClientRect();
  startPageDrag(direction, {
    preventDefault() {},
    clientX: direction > 0 ? rect.right : rect.left,
    pointerId: -1,
  });
  pageDrag.progress = 1;
  endPageDrag();
}

$('.next-button').addEventListener('click', () => go(1));
$('.prev-button').addEventListener('click', () => go(-1));
$('.hit.next').addEventListener('click', event => { if (event.detail === 0) go(1); });
$('.hit.prev').addEventListener('click', event => { if (event.detail === 0) go(-1); });
reader.scrubber.addEventListener('input', event => { page = Number(event.target.value); render(); });

document.addEventListener('keydown', event => {
  if (document.body.classList.contains('index-open')) return;
  if (document.activeElement === filmstrip) return;
  if (readerSection.hidden) return;
  if (event.key === 'ArrowRight') go(1);
  if (event.key === 'ArrowLeft') go(-1);
});

fullscreenButton.addEventListener('click', () => {
  if (document.fullscreenElement) document.exitFullscreen();
  else $('#reader').requestFullscreen();
});

addEventListener('resize', () => {
  if (!readerSection.hidden) render();
  setGalleryIndex(galleryIndex, 'auto');
});

updateGalleryUI();
scheduleAutoplay();
