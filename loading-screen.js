/* La entrada se libera al cargar el arte o tras cinco segundos, incluso si app.js falla. */
(() => {
  const root = document.documentElement;
  let finished = false;
  root.classList.add('is-loading');

  function finish() {
    finished = true;
    const loader = document.getElementById('site-loader');
    if (loader?.contains(document.activeElement)) {
      document.querySelector('.hero-cta')?.focus({ preventScroll: true });
    }
    root.classList.remove('is-loading');
    loader?.setAttribute('aria-hidden', 'true');
    clearTimeout(deadline);
  }

  const deadline = setTimeout(finish, 5000);
  function ready() {
    const loader = document.getElementById('site-loader');
    if (finished) {
      loader?.setAttribute('aria-hidden', 'true');
      return;
    }
    loader?.setAttribute('aria-hidden', 'false');
    document.getElementById('loader-skip')?.addEventListener('click', finish, { once: true });

    // Solo se espera al arte de entrada: audio y contenido secundario siguen en paralelo.
    const criticalImages = document.querySelectorAll('.loader-logo, .hero-art');
    const images = [...criticalImages].map(image => {
      if (typeof image.decode === 'function') return image.decode();
      if (image.complete) return Promise.resolve();
      return new Promise(resolve => {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', resolve, { once: true });
      });
    });
    Promise.allSettled([...images, document.fonts?.ready]).then(finish);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true });
  else ready();
})();
