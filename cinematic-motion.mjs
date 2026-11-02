// La animación es decorativa. El póster y toda la página funcionan sin vídeo.
export function initCinematicMotion(document, icon) {
  const hero = document.querySelector('.hero');
  const video = document.querySelector('#hero-motion');
  const button = document.querySelector('#motion-toggle');
  const reduced = document.defaultView.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(document.defaultView.navigator.connection?.saveData);
  let manualPaused = false;
  let systemOverride = false;
  let suppressed = false;
  let inView = true;
  let source = null;
  let generation = 0;
  const isPaused = () => manualPaused || (!systemOverride && (reduced.matches || saveData));

  function update() {
    const paused = isPaused();
    const stopped = paused || suppressed || document.hidden || !inView;
    const revision = ++generation;
    hero.classList.toggle('motion-paused', stopped);
    button.setAttribute('aria-pressed', String(paused));
    button.setAttribute('aria-label', paused ? 'Reanudar animación de portada' : 'Pausar animación de portada');
    button.innerHTML = `${icon(paused ? 'play' : 'pause')}<span>Animación</span>`;
    if (stopped) { video.pause(); return; }
    if (!source) return;
    if (!video.getAttribute('src')) { video.src = source; video.preload = 'metadata'; }
    Promise.resolve(video.play()).then(() => {
      // Un play pendiente no puede revertir una pausa o el cierre de pestaña.
      if (revision !== generation) return;
      hero.classList.add('has-motion');
    }).catch(() => {
      if (revision === generation) hero.classList.remove('has-motion');
    });
  }

  button.addEventListener('click', () => {
    if(isPaused()) { manualPaused = false; systemOverride = true; }
    else { manualPaused = true; systemOverride = false; }
    update();
  });
  document.addEventListener('visibilitychange', update);
  reduced.addEventListener('change', () => { systemOverride = false; update(); });
  video.addEventListener('error', () => hero.classList.remove('has-motion'));
  const Observer = document.defaultView.IntersectionObserver;
  if (Observer) new Observer(entries => { inView = entries[0].isIntersecting; update(); }, {threshold:0}).observe(hero);
  update();
  return {
    setAssets(assets) { source = assets.hero || null; update(); },
    setModalOpen(open) { suppressed = open; update(); }
  };
}
