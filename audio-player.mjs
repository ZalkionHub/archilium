const DEFAULT_VOLUME = 0.35;
const PREFERENCES_KEY = 'archilium-audio-v1';
const clampVolume = value => Number.isFinite(Number(value)) ? Math.min(1, Math.max(0, Number(value))) : DEFAULT_VOLUME;

export function readAudioPreferences(storage) {
  try {
    const saved = JSON.parse(storage?.getItem(PREFERENCES_KEY) || 'null');
    return { volume: typeof saved?.volume === 'number' ? clampVolume(saved.volume) : DEFAULT_VOLUME, muted: saved?.muted === true };
  } catch {
    return { volume: DEFAULT_VOLUME, muted: false };
  }
}

export function saveAudioPreferences(storage, audio) {
  try { storage?.setItem(PREFERENCES_KEY, JSON.stringify({ volume: audio.volume, muted: audio.muted })); }
  catch { /* El reproductor funciona también si el almacenamiento está bloqueado. */ }
}

export class AudioPlayback {
  constructor(audio, { volume = DEFAULT_VOLUME, muted = false, onChange = () => {} } = {}) {
    this.audio = audio;
    this.onChange = onChange;
    this.state = 'paused';
    this.userPaused = false;
    this.requestId = 0;
    this.lastAudibleVolume = clampVolume(volume) || DEFAULT_VOLUME;
    audio.volume = clampVolume(volume);
    audio.muted = muted === true;
    audio.addEventListener('play', () => {
      if (this.userPaused) { audio.pause(); return; }
      this.state = 'playing';
      this.onChange();
    });
    audio.addEventListener('pause', () => {
      if (!['blocked', 'error'].includes(this.state)) this.state = 'paused';
      this.onChange();
    });
    audio.addEventListener('error', () => { this.state = 'error'; this.onChange(); });
    audio.addEventListener('volumechange', () => this.onChange());
  }

  get needsGesture() { return this.state === 'blocked' && !this.userPaused; }

  async play() {
    const id = ++this.requestId;
    this.userPaused = false;
    this.state = 'loading';
    this.onChange();
    try {
      await this.audio.play();
      if (id !== this.requestId) {
        if (this.userPaused) this.audio.pause();
        return false;
      }
      this.state = this.audio.paused ? 'paused' : 'playing';
      this.onChange();
      return !this.audio.paused;
    } catch (error) {
      if (id !== this.requestId) return false;
      this.state = error?.name === 'NotAllowedError' ? 'blocked' : 'error';
      this.onChange();
      return false;
    }
  }

  pause() {
    this.requestId++;
    this.userPaused = true;
    this.audio.pause();
    this.state = 'paused';
    this.onChange();
  }

  toggle() {
    if (!this.audio.paused || this.state === 'loading') { this.pause(); return Promise.resolve(false); }
    return this.play();
  }

  resumeAfterGesture() {
    return this.needsGesture ? this.play() : Promise.resolve(false);
  }

  setVolume(value) {
    this.audio.volume = clampVolume(value);
    if (this.audio.volume > 0) {
      this.lastAudibleVolume = this.audio.volume;
      this.audio.muted = false;
    }
    this.onChange();
  }

  toggleMute() {
    if (this.audio.muted || this.audio.volume === 0) {
      this.audio.muted = false;
      if (this.audio.volume === 0) this.audio.volume = this.lastAudibleVolume;
    } else this.audio.muted = true;
    this.onChange();
  }
}

export function initAudioPlayer(doc, icon) {
  const audio = doc.querySelector('#ambient-audio');
  const play = doc.querySelector('#play-toggle');
  const mute = doc.querySelector('#volume-toggle');
  const volume = doc.querySelector('#music-volume');
  const progress = doc.querySelector('#track-progress');
  const status = doc.querySelector('#audio-status');
  let storage;
  try { storage = doc.defaultView.localStorage; } catch { storage = null; }
  let announcedState = '';
  const playback = new AudioPlayback(audio, { ...readAudioPreferences(storage), onChange: updateUI });
  const formatTime = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  const captions = { playing: 'Reproduciendo', paused: 'En pausa', loading: 'Cargando música…', blocked: 'Pulsa para escuchar', error: 'Música no disponible' };
  const announcements = { playing: 'Reproduciendo Regal Welcome.', paused: 'Música en pausa.', loading: 'Cargando Regal Welcome.', blocked: 'Pulsa reproducir para escuchar Regal Welcome.', error: 'No se ha podido cargar la música. Puedes intentar reproducirla de nuevo.' };

  function gesture(event) {
    if (!event.isTrusted || event.target?.closest?.('.sound-dock, .audio-panel-toggle, input, textarea, select')) return;
    if (event.type === 'keydown' && (event.repeat || event.ctrlKey || event.metaKey || event.altKey || ['Tab', 'Shift', 'Control', 'Alt', 'Meta', 'Escape'].includes(event.key))) return;
    void playback.resumeAfterGesture();
  }

  function updateProgress() {
    const ready = Number.isFinite(audio.duration) && audio.duration > 0;
    const duration = ready ? audio.duration : 0;
    progress.disabled = !ready;
    progress.max = duration || 1;
    progress.value = audio.currentTime;
    progress.style.setProperty('--progress', `${duration ? audio.currentTime / duration * 100 : 0}%`);
    doc.querySelector('#track-time').textContent = `${formatTime(audio.currentTime)} / ${ready ? formatTime(duration) : '--:--'}`;
    const panelDuration = doc.querySelector('.audio-duration');
    if (panelDuration) panelDuration.textContent = ready ? formatTime(duration) : 'Cargando duración';
  }

  function updateUI() {
    const playing = !audio.paused;
    const label = playing ? 'Pausar música' : 'Reproducir Regal Welcome';
    for (const button of [play, ...doc.querySelectorAll('.audio-panel-toggle')]) {
      button.innerHTML = icon(playing ? 'pause' : 'play');
      button.setAttribute('aria-label', label);
      button.setAttribute('aria-pressed', String(playing));
      button.setAttribute('aria-busy', String(playback.state === 'loading'));
    }
    doc.querySelector('#track-state').textContent = captions[playback.state];
    if (announcedState !== playback.state) {
      status.textContent = announcements[playback.state];
      announcedState = playback.state;
    }
    const silent = audio.muted || audio.volume === 0;
    mute.innerHTML = icon(silent ? 'muted' : 'volume');
    mute.setAttribute('aria-label', silent ? 'Activar sonido' : 'Silenciar música');
    mute.setAttribute('aria-pressed', String(silent));
    volume.value = String(audio.volume);
    volume.setAttribute('aria-valuetext', `${Math.round(audio.volume * 100)} %`);
    volume.style.setProperty('--volume', `${audio.volume * 100}%`);
    doc.querySelector('#volume-value').textContent = `${Math.round(audio.volume * 100)}%`;
    for (const event of ['pointerdown', 'keydown']) {
      if (playback.needsGesture) doc.addEventListener(event, gesture, true);
      else doc.removeEventListener(event, gesture, true);
    }
    updateProgress();
  }

  play.addEventListener('click', () => void playback.toggle());
  mute.addEventListener('click', () => { playback.toggleMute(); saveAudioPreferences(storage, audio); });
  volume.addEventListener('input', () => { playback.setVolume(Number(volume.value)); saveAudioPreferences(storage, audio); });
  progress.addEventListener('input', () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) audio.currentTime = Math.min(audio.duration, Math.max(0, Number(progress.value)));
    updateProgress();
  });
  for (const event of ['timeupdate', 'loadedmetadata', 'durationchange']) audio.addEventListener(event, updateProgress);
  updateUI();
  // Aplicar volumen antes del primer play evita iniciar al volumen máximo.
  void playback.play();
  return { toggle: () => playback.toggle(), refreshUI: updateUI };
}
