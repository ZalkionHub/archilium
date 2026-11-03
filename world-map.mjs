import { regions, mapArtwork, getRegion } from './world-map-data.mjs?v=20261103-lunia';
import { RegionEffects } from './world-map-effects.mjs';
import { watchRegionArtwork } from './region-artwork.mjs?v=20261103-bocus-scene';

const icon = name => `<svg aria-hidden="true"><use href="#icon-${name}"/></svg>`;
const safe = text => String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const compass = '<svg class="atlas-compass" viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="28"/><path d="M40 3 48 32 77 40 48 48 40 77 32 48 3 40 32 32Z"/><path d="m40 16 5 19-5 5-5-5Z" fill="currentColor"/><circle cx="40" cy="40" r="4"/></svg>';

export function renderAtlas() {
  const first = regions[0];
  return `<section class="atlas-section" id="mapa" aria-labelledby="atlas-title">
    <header class="atlas-heading"><div><p class="eyebrow">El atlas de Archilium</p><h2 id="atlas-title">Cinco regiones.<br><em>Un mismo reino.</em></h2></div><div class="atlas-intro"><p>De las forjas de Bocus a los jardines de Lunia.<br>Cada horizonte tiene algo que contar.</p><p class="atlas-instruction">Señala una región para descubrirla. Pulsa para adentrarte.</p></div>${compass}</header>
    <div class="atlas-frame">
      <div class="atlas-stage"><img class="atlas-map" src="${mapArtwork}" alt="Mapa ilustrado del Reino de Archilium: Bocus al oeste, Velan al norte, Umen en el centro, Argor al sur y Lunia al este" width="1672" height="941" loading="lazy">
        <svg class="atlas-overlays" viewBox="0 0 1672 941" aria-label="Regiones del mapa interactivo">${regions.map(region => `<a href="#region-${region.id}" role="button" tabindex="0" class="atlas-region" data-region-id="${region.id}" aria-label="Explorar ${safe(region.name)}" style="--region-color:${region.color}"><path d="${region.shape}"/></a>`).join('')}</svg>
        <div class="atlas-hover-card" hidden aria-hidden="true"><span>Descubre la región</span><strong data-hover-name></strong><p data-hover-motto></p><p data-hover-summary></p><small>Pulsa para adentrarte ${icon('arrow')}</small></div>
        <span class="atlas-art-label">Mapa ilustrado · Mundo en desarrollo</span>
      </div>
      <div class="atlas-preview" id="atlas-preview" style="--region-color:${first.color}"><div class="atlas-preview-heading"><span class="atlas-preview-kicker">Tu próximo destino</span><h3 data-atlas-name>${first.name}</h3><p data-atlas-motto>${first.motto}</p></div><p class="atlas-preview-summary" data-atlas-summary>${first.summary}</p><button class="atlas-enter" data-atlas-enter="${first.id}">Adentrarse ${icon('arrow')}</button></div>
    </div>
    <nav class="atlas-destinations" aria-label="Elegir una región de Archilium">${regions.map(region => `<button data-region-id="${region.id}" data-previewed="${region === first}" style="--region-color:${region.color}"><span></span>${region.name}${icon('arrow')}</button>`).join('')}</nav>
    <p class="atlas-footnote">Explora una interpretación animada del mapa. Lugares, habitantes e historias se amplían a medida que crece Archilium.</p>
  </section>`;
}

export function renderRegionPanel(region) {
  const { x, y, scale } = region.camera;
  // Clamp the camera to the artwork so that mobile/ultrawide never reveals blank edges.
  const tx = Math.min(0, Math.max(1672 * (1 - scale), 836 - x * scale));
  const ty = Math.min(0, Math.max(941 * (1 - scale), 470.5 - y * scale));
  return `<article class="region-experience ${region.inhabitantsArt ? 'has-inhabitants-art' : ''}" data-region="${region.id}" data-effects-paused="false" data-art-ready="false" data-people-ready="false" style="--region-color:${region.color};--camera-x:${tx}px;--camera-y:${ty}px;--camera-scale:${scale}">
    <div class="region-scenery" aria-hidden="true"><svg class="region-panorama" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid slice"><g class="region-camera"><image href="${mapArtwork}" width="1672" height="941"/></g></svg>${region.landscape ? `<img class="region-landscape" src="${region.landscape.src}" alt="" width="${region.landscape.width}" height="${region.landscape.height}" decoding="async" fetchpriority="high" style="object-position:${region.landscape.position}">` : ''}<div class="region-color-wash region-wash-${region.theme}"></div></div>
    <div class="region-shade" aria-hidden="true"></div><canvas class="region-weather" aria-hidden="true"></canvas>
    <div class="region-content"><div class="region-title-block"><p class="eyebrow">El atlas de Archilium</p><p class="region-motto">${safe(region.motto)}</p><h2 id="dialog-title">${safe(region.name)}</h2><p class="region-invitation">${safe(region.heading).replace('\n',region.inhabitantsArt?' ':'<br>')}</p>${region.inhabitantsArt ? `<figure class="region-inhabitants-art"><img src="${region.inhabitantsArt.src}" alt="${safe(region.inhabitantsArt.alt)}" width="${region.inhabitantsArt.width}" height="${region.inhabitantsArt.height}" decoding="async"><figcaption>${safe(region.inhabitantsArt.caption || 'Habitantes · Conceptos visuales')}</figcaption></figure>` : ''}<span class="region-visual-note">${region.landscape ? 'Paisaje conceptual · Historias en desarrollo' : 'Una mirada animada al mapa · En desarrollo'}</span></div>
    <div class="region-story"><p class="region-summary">${safe(region.summary)}</p><div class="region-tabs" role="tablist" aria-label="Descubrir ${safe(region.name)}"><button role="tab" id="region-tab-places" aria-controls="region-tab-content" aria-selected="true" tabindex="0" data-region-tab="places">Lugares</button><button role="tab" id="region-tab-life" aria-controls="region-tab-content" aria-selected="false" tabindex="-1" data-region-tab="life">Vida y oficios</button><button role="tab" id="region-tab-people" aria-controls="region-tab-content" aria-selected="false" tabindex="-1" data-region-tab="people">Habitantes</button></div><div class="region-tab-content" id="region-tab-content" role="tabpanel" aria-labelledby="region-tab-places" tabindex="0">${renderRegionTab(region, 'places')}</div></div></div>
    <div class="region-bottom"><div class="region-listening"><button class="audio-panel-toggle region-audio-toggle" aria-label="Reproducir música" aria-pressed="false">${icon('play')}</button><div><span>${region.music ? 'La música de Bocus' : 'Ambiente del reino'}</span><strong>${region.music?.name || 'Regal Welcome'}</strong><small data-region-audio-state>Preparando música…</small></div><button class="region-mute-toggle" data-audio-mute aria-label="Silenciar música" aria-pressed="false">${icon('volume')}</button><label class="region-volume"><span class="sr-only">Volumen de la música regional</span><input type="range" min="0" max="1" step="0.01" value="0.35" data-audio-volume aria-label="Volumen de la música regional"></label></div><button class="region-effects-toggle" data-region-effects aria-pressed="false">${icon('pause')}<span>Pausar efectos</span></button></div>
    <nav class="region-switcher" aria-label="Viajar a otra región">${regions.map(item => `<button data-panel="region-${item.id}" ${item.id === region.id ? 'aria-current="page"' : ''}><span style="background:${item.color}"></span>${item.shortName}</button>`).join('')}</nav>
  </article>`;
}

export function renderRegionTab(region, tab) {
  if (tab === 'life') return `<div class="region-life"><span class="region-detail-kicker">El carácter de la región</span><p>${safe(region.life)}</p><p class="region-development">Mundo en desarrollo</p></div>`;
  if (tab === 'people') return `<div class="region-people">${region.inhabitantsArt ? `<span class="region-detail-kicker">${safe(region.inhabitantsArt.peopleHeading || 'Los rostros de la región')}</span><div class="region-resident-roles">${region.inhabitantsArt.roles.map(role => `<span>${safe(role)}</span>`).join('')}</div>` : ''}${region.residents.map(person => `<button class="region-person" data-panel="ficha-${person.id}"><span class="region-person-initial" aria-hidden="true">${person.name[0]}</span><span><strong>${person.name}</strong><small>${safe(person.role)}</small></span>${icon('arrow')}</button>`).join('')}<p>${safe(region.residentsNote)}</p>${region.residents.length ? '' : '<span class="region-development">Historias en desarrollo</span>'}</div>`;
  return `<ul class="region-places">${region.places.map(place => `<li><span class="region-place-mark" aria-hidden="true">◇</span><div><h3>${safe(place.name)}</h3><span>${safe(place.kind)}</span><p>${safe(place.text)}</p></div></li>`).join('')}</ul>`;
}

export function initWorldMap(doc, { player, onPreview = () => {} } = {}) {
  const win = doc.defaultView;
  const preview = doc.querySelector('#atlas-preview');
  const hoverCard = doc.querySelector('.atlas-hover-card');
  const stage = doc.querySelector('.atlas-stage');
  let activeRegion = null;
  let effects = null;
  let releaseArtwork = () => {};
  let manualPause = false;
  const reduced = win.matchMedia('(prefers-reduced-motion: reduce)');

  function previewRegion(id) {
    const region = getRegion(id);
    if (!region || !preview) return;
    preview.style.setProperty('--region-color', region.color);
    preview.querySelector('[data-atlas-name]').textContent = region.name;
    preview.querySelector('[data-atlas-motto]').textContent = region.motto;
    preview.querySelector('[data-atlas-summary]').textContent = region.summary;
    preview.querySelector('[data-atlas-enter]').dataset.atlasEnter = id;
    for (const button of doc.querySelectorAll('.atlas-destinations [data-region-id]')) button.dataset.previewed = String(button.dataset.regionId === id);
    for (const path of doc.querySelectorAll('.atlas-region')) path.classList.toggle('is-previewed', path.dataset.regionId === id);
    onPreview(region);
  }

  function showHover(element, event) {
    const region = getRegion(element.dataset.regionId);
    if (!region || !element.classList.contains('atlas-region')) return;
    hoverCard.style.setProperty('--region-color', region.color);
    hoverCard.querySelector('[data-hover-name]').textContent = region.name;
    hoverCard.querySelector('[data-hover-motto]').textContent = region.motto;
    hoverCard.querySelector('[data-hover-summary]').textContent = region.summary;
    hoverCard.hidden = false;
    positionHover(element, event);
  }

  function positionHover(element, event) {
    const bounds = stage.getBoundingClientRect();
    const area = element.getBoundingClientRect();
    const x = event?.clientX ?? area.left + area.width / 2;
    const y = event?.clientY ?? area.top + area.height / 2;
    const width = hoverCard.offsetWidth, height = hoverCard.offsetHeight;
    const left = x - bounds.left + 20;
    hoverCard.style.left = `${Math.max(12, Math.min(bounds.width - width - 12, left + width > bounds.width - 12 ? x - bounds.left - width - 20 : left))}px`;
    hoverCard.style.top = `${Math.max(12, Math.min(bounds.height - height - 12, y - bounds.top - 40))}px`;
  }

  for (const element of doc.querySelectorAll('[data-region-id]')) {
    element.addEventListener('pointerenter', event => { previewRegion(element.dataset.regionId); showHover(element, event); });
    element.addEventListener('pointermove', event => { if (!hoverCard.hidden) positionHover(element, event); });
    element.addEventListener('focus', () => { previewRegion(element.dataset.regionId); showHover(element); });
    element.addEventListener('blur', () => { hoverCard.hidden = true; });
    // SVG anchors support Enter natively; Space should behave like the advertised button.
    element.addEventListener('keydown', event => { if (event.key === ' ') { event.preventDefault(); element.dispatchEvent(new win.MouseEvent('click', { bubbles: true, cancelable: true })); } });
  }
  stage.addEventListener('pointerleave', () => { hoverCard.hidden = true; });

  function syncEffects() {
    if (!activeRegion) return;
    const paused = manualPause || reduced.matches || doc.hidden;
    const experience = doc.querySelector('.region-experience');
    experience.dataset.effectsPaused = String(paused);
    // Al detener la entrada, conservar el arte visible al volver a reanudar.
    if (paused) experience.dataset.artStatic = 'true';
    const button = experience.querySelector('[data-region-effects]');
    button.disabled = reduced.matches;
    button.setAttribute('aria-pressed', String(manualPause || reduced.matches));
    button.innerHTML = `${icon(paused ? 'play' : 'pause')}<span>${reduced.matches ? 'Movimiento reducido' : manualPause ? 'Reanudar efectos' : 'Pausar efectos'}</span>`;
    if (paused) effects?.stop(); else effects?.start();
  }

  function leaveRegion() {
    releaseArtwork();
    releaseArtwork = () => {};
    effects?.destroy();
    effects = null;
    activeRegion = null;
  }

  function enterRegion(region) {
    leaveRegion();
    hoverCard.hidden = true;
    activeRegion = region;
    releaseArtwork = watchRegionArtwork(doc.querySelector('.region-experience'));
    previewRegion(region.id);
    effects = new RegionEffects(doc.querySelector('.region-weather'), region.theme, win);
    player.selectTrack(region.music || undefined);
    syncEffects();
  }

  doc.addEventListener('click', event => {
    const effectsButton = event.target.closest('[data-region-effects]');
    if (effectsButton) { manualPause = !manualPause; syncEffects(); }
    const tab = event.target.closest('[data-region-tab]');
    if (tab && activeRegion) {
      for (const button of doc.querySelectorAll('[data-region-tab]')) { button.setAttribute('aria-selected', String(button === tab)); button.tabIndex = button === tab ? 0 : -1; }
      const content = doc.querySelector('#region-tab-content');
      content.innerHTML = renderRegionTab(activeRegion, tab.dataset.regionTab);
      content.setAttribute('aria-labelledby', tab.id);
    }
  });
  doc.addEventListener('keydown', event => {
    if (!event.target.matches('[data-region-tab]') || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const tabs = [...doc.querySelectorAll('[data-region-tab]')];
    const position = tabs.indexOf(event.target);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (position + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    tabs[next].focus(); tabs[next].click();
  });
  reduced.addEventListener('change', syncEffects);
  doc.addEventListener('visibilitychange', syncEffects);
  return { enterRegion, leaveRegion, previewRegion };
}
