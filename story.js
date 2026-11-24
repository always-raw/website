/* ============================================================
   story.js — SHARED by all story pages. Do not edit per story.
   Builds the lightbox automatically: any <figure class="story-photo">
   on the page becomes clickable and joins one navigable sequence.
   Captions are read from .photo-caption or a plain <figcaption>.
   ============================================================ */
(function () {
  'use strict';

  var figures = Array.prototype.slice.call(document.querySelectorAll('.story-photo'));
  if (!figures.length) return; // story with no photos still loads fine

  var photos = figures.map(function (fig) {
    var img = fig.querySelector('img');
    var cap = fig.querySelector('.photo-caption') || fig.querySelector('figcaption');
    return { img: img, caption: cap ? cap.textContent : '' };
  }).filter(function (p) { return p.img; });

  if (!photos.length) return;

  // ---- Build the lightbox (nothing needed in the HTML) ----
  var lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML =
    '<button class="lightbox-close" aria-label="Close">&times;</button>' +
    '<button class="lightbox-prev" aria-label="Previous photo">&#8249;</button>' +
    '<button class="lightbox-next" aria-label="Next photo">&#8250;</button>' +
    '<img alt="">' +
    '<p class="lightbox-caption"></p>';
  document.body.appendChild(lightbox);

  var lightboxImg     = lightbox.querySelector('img');
  var lightboxCaption = lightbox.querySelector('.lightbox-caption');

  var current = 0;

  function show(i) {
    current = (i + photos.length) % photos.length; // wraps at both ends
    lightboxImg.src = photos[current].img.src;
    lightboxCaption.textContent = photos[current].caption;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden'; // stop page scroll behind overlay
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  // Click a photo -> open it
  photos.forEach(function (photo, i) {
    photo.img.parentElement.addEventListener('click', function () { show(i); });
  });

  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', function () { show(current - 1); });
  lightbox.querySelector('.lightbox-next').addEventListener('click', function () { show(current + 1); });

  // Click the dark background (not the photo/buttons) -> close
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard: arrows only while the lightbox is open, Esc always closes
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'ArrowLeft')  show(current - 1);
    if (e.key === 'Escape')     closeLightbox();
  });
})();