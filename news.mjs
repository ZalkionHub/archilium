import { getNewsApiUrl } from './news-config.mjs?v=20261105-news';

export const PAGE_SIZE = 12;
export const FALLBACK_COVER = 'https://zalkionhub.github.io/archilium/assets/archilium-hero-grounded.png';
const DAY = 86_400_000;
const dateFormat = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Madrid' });

function text(value, length, fallback = '') {
  return typeof value === 'string' ? value.trim().slice(0, length) : fallback;
}

export function safeCoverUrl(value, apiOrigin) {
  try {
    if (!value || typeof value !== 'string' || value.length > 2048) return FALLBACK_COVER;
    const url = new URL(value, apiOrigin);
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    if ((url.protocol !== 'https:' && !(local && url.protocol === 'http:')) || url.username || url.password) return FALLBACK_COVER;
    return url.href;
  } catch { return FALLBACK_COVER; }
}

export function normalizeNewsItem(raw, apiOrigin, detail = false) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Respuesta de noticia inválida');
  if (typeof raw.slug !== 'string' || raw.slug.length > 180) throw new Error('Identificador de noticia inválido');
  const slug = raw.slug.trim();
  const title = text(raw.title, 200);
  const published = Date.parse(raw.publishedAt);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !title || !Number.isFinite(published)) throw new Error('Respuesta de noticia inválida');
  if (detail && (typeof raw.body !== 'string' || raw.body.length > 50_000)) throw new Error('Texto de noticia inválido');
  const coverUrl = safeCoverUrl(raw.coverUrl, apiOrigin);
  return {
    id: text(String(raw.id ?? slug), 180), slug, title,
    excerpt: text(raw.excerpt, 600), category: text(raw.category, 70, 'Desarrollo') || 'Desarrollo',
    coverUrl, coverAlt: coverUrl === FALLBACK_COVER ? 'Arte conceptual de Archilium' : text(raw.coverAlt, 500, title),
    publishedAt: new Date(published).toISOString(), updatedAt: text(raw.updatedAt, 50),
    featured: raw.featured === true, body: detail ? raw.body : '',
  };
}

export function parseNewsPage(raw, apiOrigin) {
  if (!raw || !Array.isArray(raw.items) || raw.items.length > PAGE_SIZE || typeof raw.hasMore !== 'boolean' || (raw.hasMore && raw.items.length === 0)) throw new Error('Respuesta de novedades inválida');
  return { items: raw.items.map(item => normalizeNewsItem(item, apiOrigin)), hasMore: raw.hasMore };
}

export function newsBadge(item, now = Date.now()) {
  if (item.featured) return 'Destacada';
  const age = now - Date.parse(item.publishedAt);
  return age >= 0 && age <= 14 * DAY ? 'Nuevo' : '';
}

function node(doc, tag, className = '', content = '') {
  const result = doc.createElement(tag);
  result.className = className;
  if (content) result.textContent = content;
  return result;
}

function cover(doc, item, className) {
  const img = node(doc, 'img', className);
  img.src = item.coverUrl;
  img.alt = item.coverAlt;
  img.width = 1600;
  img.height = 900;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.referrerPolicy = 'strict-origin-when-cross-origin';
  img.addEventListener('error', () => {
    if (img.src === FALLBACK_COVER) { img.hidden = true; return; }
    img.src = FALLBACK_COVER;
    img.alt = 'Arte conceptual de Archilium';
  });
  return img;
}

function metadata(doc, item, className) {
  const meta = node(doc, 'div', className);
  const date = node(doc, 'time', '', dateFormat.format(new Date(item.publishedAt)));
  date.dateTime = item.publishedAt;
  meta.append(node(doc, 'span', '', item.category), date);
  return meta;
}

export function createNewsCard(doc, item, open, now = Date.now()) {
  const card = node(doc, 'article', 'news-card');
  const art = node(doc, 'div', 'news-card-art');
  art.append(cover(doc, item, 'news-card-cover'));
  const badge = newsBadge(item, now);
  if (badge) art.append(node(doc, 'span', 'news-badge', badge));
  const copy = node(doc, 'div', 'news-card-copy');
  const title = node(doc, 'h3', 'news-card-title');
  const button = node(doc, 'button', 'news-card-button', item.title);
  button.type = 'button';
  button.setAttribute('aria-label', `Leer noticia: ${item.title}`);
  button.addEventListener('click', () => open(item, button));
  title.append(button);
  const read = node(doc, 'span', 'news-card-read', 'Leer noticia');
  const arrow = node(doc, 'span', '', '↗');
  arrow.setAttribute('aria-hidden', 'true');
  read.setAttribute('aria-hidden', 'true');
  read.append(arrow);
  copy.append(metadata(doc, item, 'news-meta'), title, node(doc, 'p', 'news-card-excerpt', item.excerpt), read);
  card.append(art, copy);
  return card;
}

export function renderNewsArticle(doc, item) {
  const article = node(doc, 'article', 'news-article');
  article.append(cover(doc, item, 'news-article-cover'), metadata(doc, item, 'news-meta news-article-meta'));
  if (item.excerpt) article.append(node(doc, 'p', 'news-article-lead', item.excerpt));
  const body = node(doc, 'div', 'news-article-text');
  for (const paragraph of item.body.split(/\r?\n\s*\r?\n/).filter(part => part.trim())) body.append(node(doc, 'p', '', paragraph));
  article.append(body);
  return article;
}

export class NewsFeed {
  constructor(doc, { apiUrl = getNewsApiUrl(doc), fetcher = globalThis.fetch?.bind(globalThis), now = Date.now, timeoutMs = 15_000 } = {}) {
    this.doc = doc;
    this.apiUrl = apiUrl;
    this.fetcher = fetcher;
    this.now = now;
    this.timeoutMs = timeoutMs;
    this.grid = doc.getElementById('news-grid');
    this.status = doc.getElementById('news-status');
    this.retry = doc.getElementById('news-retry');
    this.more = doc.getElementById('news-more');
    this.dialog = doc.getElementById('news-dialog');
    this.reader = doc.getElementById('news-reader');
    this.readerTitle = doc.getElementById('news-article-title');
    this.closeButton = doc.getElementById('news-close');
    this.items = new Map();
    this.offset = 0;
    this.hasMore = true;
    this.loading = false;
    this.detailVersion = 0;
    this.detailAbort = null;
    this.returnFocus = null;
    this.retry.addEventListener('click', () => void this.loadMore());
    this.more.addEventListener('click', () => void this.loadMore());
    this.closeButton.addEventListener('click', () => this.dialog.close());
    this.dialog.addEventListener('click', event => { if (event.target === this.dialog) this.dialog.close(); });
    this.dialog.addEventListener('close', () => {
      this.detailVersion++;
      this.detailAbort?.abort();
      this.dialog.setAttribute('aria-busy', 'false');
      if (this.returnFocus && this.doc.contains(this.returnFocus)) this.returnFocus.focus({ preventScroll: true });
    });
  }

  async request(path, signal) {
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (signal?.aborted) controller.abort();
    signal?.addEventListener('abort', abort, { once: true });
    const timeout = setTimeout(abort, this.timeoutMs);
    try {
      const response = await this.fetcher(new URL(path, this.apiUrl).href, { method: 'GET', credentials: 'omit', cache: 'no-store', headers: { Accept: 'application/json' }, signal: controller.signal });
      if (!response.ok) throw Object.assign(new Error('No se ha podido cargar la noticia'), { status: response.status });
      return await response.json();
    } finally {
      clearTimeout(timeout);
      signal?.removeEventListener('abort', abort);
    }
  }

  async loadMore() {
    if (this.loading || !this.hasMore) return false;
    this.loading = true;
    this.grid.setAttribute('aria-busy', 'true');
    this.retry.hidden = true;
    this.more.disabled = true;
    this.status.textContent = this.items.size ? 'Cargando más novedades…' : 'Cargando novedades…';
    try {
      const page = parseNewsPage(await this.request(`/api/news?limit=${PAGE_SIZE}&offset=${this.offset}`), this.apiUrl);
      this.offset += page.items.length;
      this.hasMore = page.hasMore;
      for (const item of page.items) {
        if (this.items.has(item.slug)) continue;
        this.items.set(item.slug, item);
        this.grid.append(createNewsCard(this.doc, item, (entry, trigger) => void this.openArticle(entry, trigger), this.now()));
      }
      this.more.hidden = !this.hasMore;
      this.status.textContent = this.items.size ? `Mostrando ${this.items.size} ${this.items.size === 1 ? 'novedad' : 'novedades'}.` : 'Todavía no hay novedades publicadas. Pronto compartiremos más sobre Archilium.';
      return true;
    } catch {
      this.retry.hidden = false;
      this.more.hidden = true;
      this.status.textContent = this.items.size ? 'No hemos podido cargar más novedades. Puedes volver a intentarlo.' : 'No se han podido cargar las novedades. Vuelve a intentarlo en unos instantes.';
      return false;
    } finally {
      this.loading = false;
      this.grid.setAttribute('aria-busy', 'false');
      this.more.disabled = false;
    }
  }

  async openArticle(item, trigger) {
    this.detailAbort?.abort();
    const version = ++this.detailVersion;
    this.detailAbort = new AbortController();
    this.returnFocus = trigger || this.doc.activeElement;
    this.readerTitle.textContent = item.title;
    const loading = node(this.doc, 'p', 'news-reader-status', 'Cargando noticia…');
    loading.setAttribute('role', 'status');
    this.reader.replaceChildren(loading);
    this.dialog.setAttribute('aria-busy', 'true');
    if (!this.dialog.open) this.dialog.showModal();
    this.closeButton.focus({ preventScroll: true });
    this.reader.scrollTop = 0;
    try {
      const result = await this.request(`/api/news/${encodeURIComponent(item.slug)}`, this.detailAbort.signal);
      const article = normalizeNewsItem(result?.item, this.apiUrl, true);
      if (version !== this.detailVersion || !this.dialog.open) return false;
      this.readerTitle.textContent = article.title;
      this.reader.replaceChildren(renderNewsArticle(this.doc, article));
      return true;
    } catch (error) {
      if (version !== this.detailVersion || !this.dialog.open) return false;
      const message = node(this.doc, 'p', 'news-reader-status', error.status === 404 ? 'Esta novedad ya no está disponible.' : 'No se ha podido abrir la noticia. Puedes volver a intentarlo.');
      message.setAttribute('role', 'status');
      this.reader.replaceChildren(message);
      if (error.status !== 404) {
        const retry = node(this.doc, 'button', 'news-action', 'Reintentar');
        retry.type = 'button';
        retry.addEventListener('click', () => void this.openArticle(item, this.returnFocus));
        this.reader.append(retry);
      }
      return false;
    } finally {
      if (version === this.detailVersion) this.dialog.setAttribute('aria-busy', 'false');
    }
  }
}

export function initNews(doc = globalThis.document, options) {
  if (!doc?.getElementById('news-grid')) return null;
  const feed = new NewsFeed(doc, options);
  void feed.loadMore();
  return feed;
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initNews(document), { once: true });
  else initNews(document);
}
