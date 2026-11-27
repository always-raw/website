/* ---------- Reportage lightbox ----------
   Builds the lightbox markup itself (like header.js builds the header),
   so reportage.html stays clean and the lightbox can never go missing. */
(function () {
  const links = document.querySelectorAll('.reportage-image');
  if (!links.length) return;   // not on the reportage page — do nothing

  /* 1. Create the lightbox markup and add it to the page */
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.id = 'lightbox';
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML = `
    <button class="lightbox-close" id="lightbox-close" aria-label="Close">&times;</button>
    <button class="lightbox-btn prev" id="lightbox-prev" aria-label="Previous image">&#10094;</button>
    <figure class="lightbox-figure">
      <img class="lightbox-img" id="lightbox-img" src="" alt="">
      <figcaption class="lightbox-caption" id="lightbox-caption"></figcaption>
    </figure>
    <button class="lightbox-btn next" id="lightbox-next" aria-label="Next image">&#10095;</button>
  `;
  document.body.appendChild(lightbox);

  /* 2. Grab references to the pieces we just created */
  const imgEl     = document.getElementById('lightbox-img');
  const captionEl = document.getElementById('lightbox-caption');
  const closeBtn  = document.getElementById('lightbox-close');
  const prevBtn   = document.getElementById('lightbox-prev');
  const nextBtn   = document.getElementById('lightbox-next');
  const images    = Array.from(links);
  let current     = 0;

  /* 3. Open / close / navigate */
  function open(i) {
    current = (i + images.length) % images.length;   // wraps around at both ends
    const link = images[current];
    const thumb = link.querySelector('img');
    imgEl.src = link.getAttribute('href');
    captionEl.textContent =
      (link.querySelector('.reportage-caption') || {}).textContent || '';
    imgEl.alt = thumb ? thumb.alt : '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';   // stop the page scrolling behind
  }

  function close() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* 4. Wire everything up */
  images.forEach((a, i) => a.addEventListener('click', (e) => {
    e.preventDefault();   // stop the browser following the <a href="…jpg">
    open(i);
  }));

  closeBtn.addEventListener('click', close);
  prevBtn .addEventListener('click', () => open(current - 1));
  nextBtn .addEventListener('click', () => open(current + 1));

  // click the black background to close (but not the image itself)
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

  // keyboard: Esc closes, arrows navigate
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  open(current - 1);
    if (e.key === 'ArrowRight') open(current + 1);
  });

  // touch: swipe left/right on mobile
  let startX = null;
  lightbox.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) open(current + (dx < 0 ? 1 : -1));   // >50px counts as a swipe
    startX = null;
  });
})();
