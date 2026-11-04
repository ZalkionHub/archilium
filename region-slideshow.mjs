// Cada vista es dueña de sus descargas y temporizadores. El trío y el audio
// permanecen fuera del pase: solo cambia la capa del paisaje.
export class RegionSlideshow {
  constructor(experience, win, { interval = 8000, loadTimeout = 12000 } = {}) {
    this.experience = experience;
    this.win = win;
    this.interval = interval;
    this.loadTimeout = loadTimeout;
    this.images = [...experience.querySelectorAll('.region-slide')];
    this.controls = experience.querySelector('[data-region-slideshow]');
    this.buttons = [...this.controls.querySelectorAll('[data-slide-index]')];
    this.toggle = this.controls.querySelector('[data-slide-toggle]');
    this.label = this.controls.querySelector('[data-slide-label]');
    this.description = this.controls.querySelector('[data-scene-description]');
    this.status = this.controls.querySelector('[data-slide-status]');
    const initial = Number(experience.dataset.initialSlide) || 0;
    this.current = this.images[initial] ? initial : 0;
    this.pending = null;
    this.timer = null;
    this.loadingTimer = null;
    this.blocked = true;
    this.manualPause = false;
    this.disposed = false;
    this.states = this.images.map((image, i) => i === this.current ? image.complete ? image.naturalWidth > 0 ? 'ready' : 'failed' : 'loading' : 'idle');
    this.listeners = this.images.map((image, index) => {
      const load = () => this.loaded(index);
      const error = () => this.failed(index);
      image.addEventListener('load', load);
      image.addEventListener('error', error);
      return () => { image.removeEventListener('load', load); image.removeEventListener('error', error); };
    });
    this.click = event => {
      const choice = event.target.closest('[data-slide-index]');
      if (choice) this.select(Number(choice.dataset.slideIndex));
      if (event.target.closest('[data-slide-toggle]')) {
        this.manualPause = !this.manualPause;
        if (this.manualPause && this.pending && !this.pending.manual) this.cancelPending();
        this.schedule();
        this.update();
      }
    };
    this.controls.addEventListener('click', this.click);
    this.update();
  }

  clearTimer() {
    if (this.timer !== null) this.win.clearTimeout(this.timer);
    this.timer = null;
  }

  cancelPending() {
    if (this.loadingTimer !== null) this.win.clearTimeout(this.loadingTimer);
    this.loadingTimer = null;
    this.pending = null;
    this.controls.removeAttribute('aria-busy');
  }

  setPaused(paused) {
    this.blocked = paused;
    if (paused && this.pending && !this.pending.manual) this.cancelPending();
    this.schedule();
    this.update();
  }

  schedule() {
    this.clearTimer();
    if (this.disposed || this.blocked || this.manualPause || this.pending || this.states[this.current] === 'loading') return;
    if (!this.states.some((state, index) => index !== this.current && state !== 'failed')) return;
    const timer = this.win.setTimeout(() => {
      if (this.timer !== timer) return;
      this.timer = null;
      if (this.disposed || this.blocked || this.manualPause) return;
      for (let step = 1; step < this.images.length; step++) {
        const index = (this.current + step) % this.images.length;
        if (this.states[index] !== 'failed') { this.select(index, false); break; }
      }
    }, this.interval);
    this.timer = timer;
  }

  select(index, manual = true) {
    if (this.disposed || !Number.isInteger(index) || !this.images[index] || this.states[index] === 'failed') return;
    this.clearTimer();
    this.cancelPending();
    if (index === this.current) { this.schedule(); return; }
    if (this.states[index] === 'ready') { this.show(index, manual); return; }
    this.pending = { index, manual };
    this.controls.setAttribute('aria-busy', 'true');
    if (manual) this.status.textContent = `Cargando ${this.images[index].dataset.slideLabel}…`;
    const loadingTimer = this.win.setTimeout(() => {
      if (this.loadingTimer !== loadingTimer) return;
      this.loadingTimer = null;
      if (!this.disposed && this.pending?.index === index) this.failed(index);
    }, this.loadTimeout);
    this.loadingTimer = loadingTimer;
    const image = this.images[index];
    if (this.states[index] === 'idle') {
      this.states[index] = 'loading';
      image.src = image.dataset.src;
    }
    // Una imagen de caché puede estar completa antes de suscribir el evento.
    if (image.complete) { if (image.naturalWidth > 0) this.loaded(index); else this.failed(index); }
  }

  selectById(id) {
    const index = this.images.findIndex(image => image.dataset.slideId === id);
    if (this.disposed || index < 0 || this.states[index] === 'failed') return false;
    this.select(index);
    return true;
  }

  loaded(index) {
    if (this.disposed || this.images[index].naturalWidth === 0) return;
    this.states[index] = 'ready';
    if (this.pending?.index === index) {
      const { manual } = this.pending;
      this.cancelPending();
      if (manual || (!this.blocked && !this.manualPause)) this.show(index, manual);
    } else if (index === this.current) {
      this.experience.dataset.artReady = 'true';
      this.schedule();
    }
    this.update();
  }

  failed(index) {
    if (this.disposed) return;
    this.states[index] = 'failed';
    if (this.pending?.index === index) {
      if (this.pending.manual) this.status.textContent = 'No se pudo cargar este paisaje. Se conserva la vista anterior.';
      this.cancelPending();
    }
    this.schedule();
    this.update();
  }

  show(index, manual) {
    this.current = index;
    this.experience.dataset.artReady = 'true';
    this.images.forEach((image, i) => image.classList.toggle('is-current', i === index));
    this.label.textContent = this.images[index].dataset.slideLabel;
    if (this.description) {
      this.description.textContent = this.images[index].dataset.slideDescription || '';
      this.description.hidden = !this.description.textContent;
    }
    if (manual) this.status.textContent = `Paisaje: ${this.label.textContent}.`;
    this.update();
    this.schedule();
  }

  update() {
    if (this.disposed) return;
    this.experience.dataset.slideshowPaused = String(this.blocked || this.manualPause);
    this.controls.querySelector('[data-slide-mode]').textContent = this.blocked || this.manualPause ? 'Pase en pausa' : 'Pase automático · 8 s';
    this.toggle.setAttribute('aria-pressed', String(this.manualPause));
    this.toggle.querySelector('span').textContent = this.manualPause ? 'Reanudar pase' : 'Pausar pase';
    this.toggle.querySelector('use').setAttribute('href', this.manualPause ? '#icon-play' : '#icon-pause');
    this.buttons.forEach((button, i) => {
      button.setAttribute('aria-pressed', String(i === this.current));
      button.disabled = this.states[i] === 'failed';
      if (button.disabled) button.title = 'Paisaje no disponible';
      else button.removeAttribute('title');
    });
  }

  destroy() {
    this.disposed = true;
    this.clearTimer();
    this.cancelPending();
    this.controls.removeEventListener('click', this.click);
    this.listeners.forEach(remove => remove());
  }
}
