// La entrada instala el paisaje preparado; se vigilan también las cargas del trío.
// El cierre elimina listeners para que una descarga tardía no reactive otra vista.
export function watchRegionArtwork(experience) {
  let disposed = false;
  const remove = [];
  for (const [selector, key] of [['.region-landscape', 'artReady'], ['.region-inhabitants-art img', 'peopleReady']]) {
    const image = experience.querySelector(selector);
    if (!image) { experience.dataset[key] = 'true'; continue; }
    const ready = () => { if (!disposed && image.naturalWidth > 0) experience.dataset[key] = 'true'; };
    const failed = () => { if (!disposed) experience.dataset[key + 'Failed'] = 'true'; };
    if (image.complete) { if (image.naturalWidth > 0) ready(); else failed(); continue; }
    image.addEventListener('load', ready);
    image.addEventListener('error', failed);
    remove.push(() => { image.removeEventListener('load', ready); image.removeEventListener('error', failed); });
  }
  return () => { disposed = true; remove.forEach(fn => fn()); };
}
