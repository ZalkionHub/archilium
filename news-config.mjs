export const NEWS_API_URL = 'https://archilium-noticias.zalkion.chatgpt.site';

const loopback = hostname => ['localhost', '127.0.0.1', '[::1]'].includes(hostname);

// A local preview may explicitly point at its local API. Public pages always use
// the deployed service; a URL parameter or injected remote host cannot replace it.
export function resolveNewsApiUrl(pageLocation, localOverride = '') {
  if (!loopback(pageLocation?.hostname) || !localOverride) return NEWS_API_URL;
  try {
    const url = new URL(localOverride);
    if (!loopback(url.hostname) || !['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) return NEWS_API_URL;
    return url.origin;
  } catch { return NEWS_API_URL; }
}

export function getNewsApiUrl(doc = globalThis.document, pageLocation = globalThis.location) {
  return resolveNewsApiUrl(pageLocation, doc?.querySelector('meta[name="news-api-url"]')?.content || '');
}
