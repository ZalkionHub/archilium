import { characters, races, creatures, compendium } from './lore-data.mjs';
import { initAudioPlayer } from './audio-player.mjs?v=20261103-map';
import { initCinematicMotion } from './cinematic-motion.mjs';
import { regions, getRegion } from './world-map-data.mjs?v=20261103-lunia-music';
import { initWorldMap, renderRegionPanel } from './world-map.mjs?v=20261103-lunia-music';

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const icon = name => `<svg aria-hidden="true"><use href="#icon-${name}"/></svg>`;
const heading = (eyebrow, title, description = '') => `<header class="panel-heading"><p class="eyebrow">${eyebrow}</p><h2 id="dialog-title">${title}</h2>${description ? `<p>${description}</p>` : ''}</header>`;
const download = (path, label) => `<a class="download-link" href="${path}" download>${icon('download')}${label}</a>`;

function safe(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function loreProfile(entry,category){
 return `${heading(entry.concept ? entry.tag : entry.group,safe(entry.name),safe(entry.role))}<div class="profile-layout ${entry.image?'':'no-image'} accent-${entry.accent}">${entry.image?`<figure><img class="profile-image" src="${entry.image}" alt="Concepto visual de ${safe(entry.name)}" width="1024" height="1536"><figcaption class="profile-note">Ilustración conceptual original · Presentación del personaje</figcaption></figure>`:''}<div>${entry.image?'':`<span class="profile-monogram" aria-hidden="true">${safe(entry.glyph)}</span>`}<span class="lore-status">${entry.concept?'Concepto en desarrollo':'Retrato narrativo en desarrollo'}</span><p class="profile-text">${safe(entry.bio)}</p><dl class="profile-facts">${entry.facts.map(([label,value])=>`<div><dt>${safe(label)}</dt><dd>${safe(value)}</dd></div>`).join('')}</dl><p class="profile-note">${entry.concept?'Nombre, rasgos y participación sujetos a la evolución del proyecto.':'La presentación combina los datos del personaje con su retrato narrativo en desarrollo. Descubre su historia durante la aventura.'}</p><button class="lore-more" data-panel="compendio" data-open-category="${category}">Volver al compendio ${icon('arrow')}</button></div></div>`;
}

const dialog = $('#content-dialog');
const dialogBody = $('#dialog-body');
dialogBody.className = 'dialog-body';
const menuToggle = $('.menu-toggle');
const navigation = $('#main-navigation');
const audio = $('#ambient-audio');
let currentPanel = '';
let compendiumCategory = 'personajes';
let returnFocus = null;
let motionAssets = {};
let atlas = null;
const motion = initCinematicMotion(document, icon);

const presentation = () => motionAssets.hero
  ? `<video class="cinema-video" controls playsinline muted preload="metadata" poster="assets/archilium-hero-grounded.png" aria-label="Presentación visual de Archilium"><source src="${motionAssets.hero}" type="video/mp4"></video>`
  : '<img class="motion-poster" src="assets/archilium-hero-grounded.png" alt="Ciudadela de Archilium al atardecer">';
const motionDownloads = () => [
  motionAssets.hero ? download(motionAssets.hero,'Descargar vídeo MP4') : '',
  motionAssets.logoGif ? download(motionAssets.logoGif,'Descargar corona GIF') : ''
].join('');

const faqs = [
  ['¿Qué es Archilium: El Reino Sucumbido?', 'Es un RPG de acción 2D con combate en tiempo real, pixel art y vista de tres cuartos. Kalys, originario de Kelus, es el protagonista fijo de su historia.'],
  ['¿Cuándo estará disponible?', 'El juego está en desarrollo y su fecha de lanzamiento todavía no se ha anunciado. Esta web presenta su universo y su dirección visual.'],
  ['¿En qué plataforma se publicará?', 'El lanzamiento está previsto para PC a través de Steam. Todavía no se ha anunciado una página de la tienda ni requisitos de sistema.'],
  ['¿Se podrá jugar en solitario?', 'Sí. La primera etapa del proyecto está centrada en una aventura single player.'],
  ['¿Habrá cooperativo online?', 'El cooperativo online con Steamworks está previsto para una segunda etapa. Sus detalles y disponibilidad se anunciarán cuando estén definidos.'],
  ['¿Hay una demo o un tráiler disponible?', 'Todavía no hay una demo pública ni un tráiler oficial. La presentación de la web es una animación de arte conceptual, creada en Jitter; no muestra gameplay.'],
  ['¿Las imágenes son capturas del juego?', 'Las ilustraciones de portada y paisaje son arte conceptual. La imagen de Kelus marcada como «Prototipo de desarrollo» sí es una captura real del juego, con gráficos e interfaz provisionales.'],
  ['¿Puedo elegir un personaje o una raza?', 'La historia se vive con Kalys como protagonista fijo. Las fichas de razas presentan conceptos para los habitantes del mundo.'],
  ['¿Las razas y criaturas son definitivas?', 'Las cuatro propuestas de razas y las familias del bestiario están marcadas como conceptos en desarrollo. Sus nombres, rasgos y participación pueden evolucionar.'],
  ['¿Puedo crear contenido sobre Archilium?', 'Sí. Prensa y Creadores ofrecen el logotipo, arte conceptual, una captura del prototipo y una ficha. Identifica cada material como arte conceptual o prototipo según corresponda.']
];

const panels = {
  presentacion: () => `${heading('Una ventana a Archilium','El reino te espera.','Arte conceptual en movimiento · 10 segundos')}${presentation()}<p class="panel-caption">Presentación visual creada en Jitter a partir de la ilustración original de Archilium. No es un tráiler ni una captura de gameplay.</p>${motionAssets.hero ? download(motionAssets.hero,'Descargar presentación MP4') : ''}`,
  animaciones: () => `${heading('La corona del reino','Una leyenda en movimiento.','Presentación de marca · 5 segundos')}<div class="motion-brand-preview"><img id="corona-motion" src="assets/archilium-corona-dorada.png" alt="Archilium: El Reino Sucumbido, corona dorada"></div>${motionAssets.logoGif ? `<button class="secondary-button gif-toggle" aria-pressed="false">${icon('play')}Reproducir animación</button>` : ''}<p class="panel-caption">Animación del logotipo original, creada en Jitter. Puedes reproducirla, detenerla o descargarla.</p>${motionDownloads()}`,
  prototipo: () => `${heading('El juego está tomando forma','Un primer paso en Kelus.','Captura real del prototipo de desarrollo')}<img class="gallery-image" src="assets/archilium-kelus-prototipo.png" alt="Kalys en el prototipo de Kelus, con interfaz de vida y acciones"><p class="panel-caption">Arte, interfaz y composición provisionales. Esta imagen muestra el estado de desarrollo; no representa la calidad final del juego.</p>${download('assets/archilium-kelus-prototipo.png','Descargar captura del prototipo')}`,
  'arte-de-fans': () => `${heading('La comunidad de Archilium','Un reino, mil miradas.','Este será el lugar para el arte de quienes también quieran imaginar Archilium.')}<img class="panel-image" src="assets/archilium-hero-grounded.png" alt="Ilustración conceptual de la ciudadela de Archilium en tierra firme"><p class="panel-caption">Ilustración conceptual de presentación</p><p class="panel-copy">La galería de la comunidad todavía no tiene obras publicadas. Más adelante compartiremos cómo participar. Mientras tanto, puedes llevarte un pequeño fragmento del reino.</p>${download('assets/archilium-hero-grounded.png','Descargar fondo de pantalla')}`,
  preguntas: () => `${heading('Antes de comenzar','Preguntas frecuentes','Las primeras respuestas sobre el juego y su desarrollo.')}<div class="faq-list">${faqs.map(([q,a],i) => `<details ${i === 0 ? 'open' : ''}><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>`,
  prensa: () => `${heading('Para contar nuestra historia','Recursos de prensa','Información del proyecto y materiales listos para descargar.')}<div class="press-grid"><div class="press-logo"><img src="assets/archilium-corona-dorada.png" alt="Archilium · El reino sucumbido" width="2172" height="724"></div><dl class="facts"><div><dt>Género</dt><dd>RPG de acción 2D</dd></div><div><dt>Estilo visual</dt><dd>Pixel art, vista 3/4</dd></div><div><dt>Plataforma prevista</dt><dd>PC · Steam</dd></div><div><dt>Primera etapa</dt><dd>Single player</dd></div><div><dt>Estado</dt><dd>En desarrollo</dd></div><div><dt>Lanzamiento</dt><dd>Fecha por anunciar</dd></div></dl></div><div class="press-images"><div><img src="assets/archilium-hero-grounded.png" alt="Portada conceptual de Archilium"><p>Portada conceptual</p></div><div><img src="assets/archilium-kelus-prototipo.png" alt="Captura real del prototipo de Kelus"><p>Prototipo de desarrollo</p></div></div>${download('assets/archilium-prensa.zip','Descargar dossier de prensa')}${download('assets/archilium-corona-dorada.png','Descargar logotipo')}<p class="panel-caption">El dossier distingue arte conceptual y captura del prototipo, e incluye logotipo y ficha del proyecto.</p>`,
  compendio: function panelCompendio(){
 return `${heading('El universo de Archilium','Compendio del reino','Personajes, propuestas de razas, criaturas, magia y las primeras páginas de los cuatro reinos.')}<div class="compendium-tools"><div class="compendium-tabs" role="tablist" aria-label="Categorías del compendio">${[['personajes','Personajes'],['razas','Razas'],['criaturas','Criaturas'],['magia','Magia'],['reino','El mundo']].map(([key,label])=>`<button role="tab" id="tab-${key}" aria-selected="${compendiumCategory===key}" tabindex="${compendiumCategory===key?0:-1}" aria-controls="compendium-results" data-category="${key}">${label}</button>`).join('')}</div><label class="compendium-search">${icon('search')}<input id="compendium-search" type="search" placeholder="Busca un nombre o una palabra" aria-label="Buscar en el compendio" autocomplete="off"></label></div><p class="compendium-heading-note" id="compendium-count" role="status" aria-live="polite"></p><div class="compendium-results" id="compendium-results" role="tabpanel" aria-labelledby="tab-${compendiumCategory}"></div>`;
},
  audio: () => `${heading('La atmósfera del reino','Regal Welcome','La música que acompaña tu visita a Archilium.')}<div class="audio-piece"><button class="audio-panel-toggle" aria-label="Reproducir Regal Welcome" aria-pressed="false">${icon(audio.paused ? 'play' : 'pause')}</button><div><h3>Regal Welcome</h3><p><span class="audio-duration">Cargando duración</span> · Reproducción en bucle</p></div></div><p class="audio-description">Deja que la música te acompañe mientras descubres el reino. Puedes pausar, continuar y ajustar el volumen desde el reproductor.</p><p class="audio-note">Si la música no comienza al abrir la página, pulsa reproducir para escucharla.</p>`,
  creadores: () => `${heading('Comparte el comienzo','Recursos para creadores','Un punto de partida para vídeos, directos y publicaciones sobre Archilium.')}<p class="panel-copy">Un RPG de acción 2D en pixel art, con Kalys como protagonista fijo. El juego está en desarrollo para PC y aún no tiene fecha de lanzamiento anunciada.</p><div class="creator-list"><div><h3>Identidad del juego</h3><p>Logotipo sobre fondo transparente y presentación animada de la corona.</p></div><div><h3>Imágenes del reino</h3><p>Portada ilustrada, estudio conceptual en pixel art y una captura real del prototipo de Kelus.</p></div><div><h3>Información para tu contenido</h3><p>Descripción, formato del juego y estado actual del proyecto.</p></div><div><h3>Al compartir</h3><p>Acredita el nombre del juego. Distingue arte conceptual y material del prototipo.</p></div></div>${download('assets/archilium-creadores.zip','Descargar recursos para creadores')}${motionDownloads()}${motionAssets.projectUrl ? `<div class="motion-links"><a href="${motionAssets.projectUrl}" target="_blank" rel="noopener">Proyecto editable en Jitter ${icon('arrow')}</a></div>` : ''}<p class="panel-caption">Las animaciones presentan el arte y la identidad de la web. La demo pública y el tráiler oficial siguen pendientes.</p>`,
  plataformas: () => `${heading('La aventura está en camino','Nos vemos en el reino.')}<div class="platform-panel">${icon('steam')}<div><h3>PC · Steam</h3><p>En desarrollo. Fecha de lanzamiento por anunciar.</p></div></div><p class="panel-copy">La primera etapa de Archilium será una aventura single player. Los enlaces de la tienda y las especificaciones estarán disponibles cuando se anuncien.</p><button class="ornate-button" data-panel="preguntas">Consultar preguntas frecuentes${icon('arrow')}</button>`,
  galeria: () => `${heading('Una ventana al mundo','Arte de Archilium','Ilustraciones conceptuales de presentación y dirección visual.')}<img class="gallery-image" id="gallery-image" src="assets/archilium-pixel-concept-grounded.png" alt="Escena conceptual de Archilium en pixel art"><div class="gallery-toggle" aria-label="Seleccionar imagen"><button data-gallery="pixel" aria-pressed="true">Estudio en pixel art</button><button data-gallery="hero" aria-pressed="false">Portada ilustrada</button></div>${download('assets/archilium-pixel-concept-grounded.png','Descargar estudio visual')}${download('assets/archilium-hero-grounded.png','Descargar portada')}`,
  creditos: () => `${heading('Detrás de esta ventana','Créditos de la web')}<div class="credits-list"><p><strong>Archilium: El Reino Sucumbido</strong><br>Universo y dirección del proyecto: Zalkion.</p><p>Ilustraciones conceptuales originales generadas con ImageGen para esta presentación. No representan capturas del videojuego ni diseños definitivos de sus personajes. La captura de Kelus procede del prototipo real y se identifica por separado. El retrato de Kalys campesino es una nueva ilustración conceptual original generada para esta web.</p><p>Logotipo de corona dorada y mapa ilustrado del Reino de Archilium aportados por el propietario. Animaciones de la ciudadela y de la corona creadas en Jitter con esos recursos originales. El atlas anima el mapa con cámara y efectos visuales para esta web.</p><p>Música de la web: «Regal Welcome», «Forge of Chiron», «Llanura Umen» y «Canción de Lunia», pistas aportadas por el propietario. Bocus, Umen y Lunia cuentan con sus respectivas pistas regionales. El paquete para creadores conserva el boceto original «Bruma de Archilium».</p><p>Tipografías: Cinzel y Barlow Condensed, distribuidas bajo licencia SIL Open Font License.<br><a href="assets/cinzel-OFL.txt">Licencia Cinzel</a> · <a href="assets/barlow-condensed-OFL.txt">Licencia Barlow Condensed</a></p><p>Razas y criaturas: conceptos en desarrollo. Las fichas ampliadas de personajes incluyen retratos narrativos sujetos a revisión. Las historias de los habitantes de las regiones están en desarrollo.</p><p>La web no utiliza cookies de seguimiento ni formularios de recogida de datos.</p></div>`
};

for(const [category,entries] of [['personajes',characters],['razas',races],['criaturas',creatures]]){
  for(const entry of entries) panels['ficha-'+entry.id]=()=>loreProfile(entry,category);
}
for(const region of regions) panels['region-'+region.id] = () => renderRegionPanel(region);

function closeMenu() {
  navigation.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded','false');
  menuToggle.setAttribute('aria-label','Abrir menú');
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('is-open',open);
  menuToggle.setAttribute('aria-expanded',String(open));
  menuToggle.setAttribute('aria-label',open ? 'Cerrar menú' : 'Abrir menú');
  if(open) $('a',navigation).focus();
});

function showPanel(name, updateHistory = true, category = 'personajes') {
  if(!panels[name]) return;
  if(!dialog.open) {
    const trigger = document.activeElement;
    returnFocus = navigation.contains(trigger) && menuToggle.getClientRects().length ? menuToggle : trigger;
  }
  closeMenu();
  currentPanel = name;
  atlas?.leaveRegion();
  const region = name.startsWith('region-') ? getRegion(name.slice(7)) : null;
  dialog.classList.toggle('is-region', Boolean(region));
  $('.dialog-close').innerHTML = region ? `Volver al mapa ${icon('close')}` : icon('close');
  $('.dialog-close').setAttribute('aria-label', region ? 'Volver al mapa' : 'Cerrar ventana');
  $$('video', dialogBody).forEach(video => video.pause());
  compendiumCategory = Object.hasOwn(compendium,category) ? category : 'personajes';
  dialogBody.innerHTML = panels[name]();
  $('.dialog-scroll').scrollTop = 0;
  if(name === 'compendio') renderCompendium();
  if(name === 'audio') player.refreshUI();
  if(!dialog.open) dialog.showModal();
  motion.setModalOpen(true);
  if(region) atlas?.enterRegion(region); else player.selectTrack();
  $('.dialog-close').focus();
  if(updateHistory) history.pushState({panel:name,category:compendiumCategory},'',`#${name}`);
}

function closePanel(clearHash = true) {
  if(!dialog.open) return;
  $$('video', dialogBody).forEach(video => video.pause());
  const gif = $('#corona-motion');
  if(gif) gif.src = 'assets/archilium-corona-dorada.png';
  const wasRegion = dialog.classList.contains('is-region');
  atlas?.leaveRegion();
  player.selectTrack();
  dialog.close();
  dialog.classList.remove('is-region');
  motion.setModalOpen(false);
  currentPanel = '';
  if(clearHash && panels[location.hash.slice(1)]) history.replaceState({},'',location.pathname+location.search+(wasRegion?'#mapa':''));
  if(wasRegion) $('#mapa').scrollIntoView({block:'center',behavior:'instant'});
  if(returnFocus instanceof HTMLElement && document.contains(returnFocus)) returnFocus.focus({preventScroll:true});
}

document.addEventListener('click', event => {
  const regionLink = event.target.closest('[data-region-id],[data-atlas-enter]');
  if(regionLink) { event.preventDefault(); showPanel('region-'+(regionLink.dataset.regionId || regionLink.dataset.atlasEnter)); return; }
  const panelLink = event.target.closest('[data-panel]');
  if(panelLink) { event.preventDefault(); showPanel(panelLink.dataset.panel,true,panelLink.dataset.openCategory || 'personajes'); return; }
  if(event.target.closest('[data-close-dialog],.dialog-close')) { event.preventDefault(); closePanel(); return; }
  if(event.target.closest('.main-navigation a')) closeMenu();
  if(event.target.closest('.audio-panel-toggle')) void player.toggle();
  const gifToggle = event.target.closest('.gif-toggle');
  if(gifToggle && motionAssets.logoGif) {
    const playing = gifToggle.getAttribute('aria-pressed') !== 'true';
    $('#corona-motion').src = playing ? motionAssets.logoGif : 'assets/archilium-corona-dorada.png';
    gifToggle.setAttribute('aria-pressed',String(playing));
    gifToggle.innerHTML = `${icon(playing ? 'pause' : 'play')}${playing ? 'Pausar animación' : 'Reproducir animación'}`;
  }
  const category = event.target.closest('[data-category]');
  if(category) {
    compendiumCategory = category.dataset.category;
    $$('[data-category]').forEach(tab => { tab.setAttribute('aria-selected',String(tab===category)); tab.tabIndex=tab===category?0:-1; });
    $('#compendium-results').setAttribute('aria-labelledby',category.id);
    history.replaceState({panel:currentPanel,category:compendiumCategory},'',location.href);
    renderCompendium();
  }
  const gallery = event.target.closest('[data-gallery]');
  if(gallery) {
    const pixel = gallery.dataset.gallery === 'pixel';
    $('#gallery-image').src = pixel ? 'assets/archilium-pixel-concept-grounded.png' : 'assets/archilium-hero-grounded.png';
    $('#gallery-image').alt = pixel ? 'Escena conceptual del reino de Archilium en pixel art' : 'Ilustración conceptual de la ciudadela de Archilium en tierra firme';
    $$('[data-gallery]').forEach(button => button.setAttribute('aria-pressed',String(button===gallery)));
  }
});

dialog.addEventListener('cancel', event => { event.preventDefault(); closePanel(); });
dialog.addEventListener('click',event => { if(event.target === dialog){ const rect=dialog.getBoundingClientRect(); if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closePanel(); }});
document.addEventListener('keydown', event => {
  if(event.key==='Escape' && navigation.classList.contains('is-open')) { closeMenu(); menuToggle.focus(); }
  if(event.target.matches('[data-category]') && ['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) {
    event.preventDefault(); const tabs=$$('[data-category]'); const i=tabs.indexOf(event.target);
    const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(i+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
    tabs[next].focus(); tabs[next].click();
  }
});

const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function renderCompendium(){
 const query=normalize($('#compendium-search')?.value||'');
 const entries=compendium[compendiumCategory].filter(entry=>normalize(`${entry.name} ${entry.role} ${entry.text}`).includes(query));
 $('#compendium-count').textContent=`${entries.length} ${entries.length===1?'entrada':'entradas'}${['razas','criaturas'].includes(compendiumCategory)?' · Conceptos en desarrollo':compendiumCategory==='personajes'?' · Retratos narrativos en desarrollo':''}`;
 $('#compendium-results').innerHTML=entries.length?entries.map(entry=>`<article class="compendium-entry"><span class="entry-glyph" aria-hidden="true">${safe(entry.glyph)}</span><h3>${safe(entry.name)}<small>${safe(entry.role)}</small></h3>${entry.concept?'<span class="entry-concept">Concepto en desarrollo</span>':''}<p>${safe(entry.text)}</p>${entry.id?`<button class="lore-more" data-panel="ficha-${entry.id}">Leer ficha <span class="sr-only">de ${safe(entry.name)}</span>${icon('arrow')}</button>`:''}</article>`).join(''):'<p class="compendium-empty" role="status">No se han encontrado entradas. Prueba con otro nombre.</p>';
}

document.addEventListener('input',event => { if(event.target.id==='compendium-search') renderCompendium(); });
window.addEventListener('popstate',event=>{const panel=location.hash.slice(1);if(panels[panel])showPanel(panel,false,event.state?.category||'personajes');else closePanel(false);});

const player = initAudioPlayer(document, icon);
atlas = initWorldMap(document, { player });
fetch('motion-assets.json').then(response => {
  if(!response.ok) throw new Error('Motion assets unavailable');
  return response.json();
}).then(assets => {
  motionAssets = assets;
  motion.setAssets(assets);
  if(['presentacion','animaciones','creadores'].includes(currentPanel)) showPanel(currentPanel,false);
}).catch(() => { /* La portada estática y los recursos principales siguen disponibles. */ });

const reveals = $$('.reveal');
if('IntersectionObserver' in window) {
  document.documentElement.classList.add('js');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) { entry.target.classList.add('is-revealed'); revealObserver.unobserve(entry.target); }
    });
  },{threshold:0.08});
  reveals.forEach(element => revealObserver.observe(element));
}
const updateHeader = () => $('#site-header').classList.toggle('is-scrolled',window.scrollY > 30);
window.addEventListener('scroll',updateHeader,{passive:true});
updateHeader();
$('#copyright-year').textContent=String(new Date().getFullYear());
if(panels[location.hash.slice(1)]) showPanel(location.hash.slice(1),false,history.state?.category||'personajes');
