// Solo se prepara el destino solicitado o señalado; no se descargan los 18 fondos.
export function entryScene(region, id) {
  return [region.landscape, ...(region.landscapeSlides || [])].find(scene => scene?.id === id) || region.landscape;
}

export class RegionEntry {
  constructor(win, { timeout = 12000 } = {}) {
    this.win = win;
    this.timeout = timeout;
    this.cache = new Map();
    this.request = 0;
  }

  ready(region, id) { return this.cache.get(entryScene(region, id)?.src)?.ready || null; }

  prepare(region, id) {
    const scene = entryScene(region, id);
    if (!scene) return Promise.reject(new Error('Paisaje no disponible'));
    if (this.cache.has(scene.src)) return this.cache.get(scene.src).promise;
    const image = new this.win.Image();
    image.decoding = 'async';
    image.fetchPriority = 'high';
    const record = { image, promise: null, ready: null };
    this.cache.set(scene.src, record);
    record.promise = new Promise((resolve, reject) => {
      let settled = false, decoding = false;
      const cleanup = () => {
        this.win.clearTimeout(timer);
        image.removeEventListener('load', loaded);
        image.removeEventListener('error', failed);
      };
      const failed = () => {
        if (settled) return;
        settled = true; cleanup();
        if (this.cache.get(scene.src) === record) this.cache.delete(scene.src);
        reject(new Error('No se pudo preparar el paisaje'));
      };
      const loaded = async () => {
        if (settled || decoding) return;
        decoding = true;
        try {
          if (!image.naturalWidth) { failed(); return; }
          if (typeof image.decode === 'function') await image.decode();
          if (settled) return;
          settled = true; cleanup();
          record.ready = { image, scene };
          resolve(record.ready);
        } catch { failed(); }
      };
      const timer = this.win.setTimeout(failed, this.timeout);
      image.addEventListener('load', loaded);
      image.addEventListener('error', failed);
      image.src = scene.src;
      if (image.complete) { if (image.naturalWidth) void loaded(); else failed(); }
    });
    return record.promise;
  }

  warm(region, id) { void this.prepare(region, id).catch(() => {}); }
  cancel() { this.request++; }

  async open(region, id, commit, fail) {
    const request = ++this.request;
    let prepared;
    try { prepared = await this.prepare(region, id); }
    catch (error) { if (request === this.request) fail(error); return; }
    if (request === this.request) commit(prepared);
  }
}

// Se monta la misma imagen ya decodificada: la primera pintura no depende de otra carga.
export function mountEntryImage(experience, prepared) {
  const placeholder = experience.querySelector('.region-landscape');
  for (const attribute of placeholder.attributes) {
    if (attribute.name !== 'src') prepared.image.setAttribute(attribute.name, attribute.value);
  }
  placeholder.replaceWith(prepared.image);
  experience.dataset.artReady = 'true';
}
