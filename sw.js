/* 校园传说 · Service Worker(v0.34 手机安装包批次)
 * 职责:整包离线缓存——安装到手机桌面后,断网也能完整游玩。
 * 要点:
 *  - 游戏用 ASSET_V=Date.now() 给 css/js 加随机查询串,本 SW 一律「去查询串归一化」存取,
 *    否则每次刷新 URL 变化、缓存永不命中。
 *  - 导航请求(index.html)network-first:在线时拿最新版,离线回落缓存。
 *  - 其余同源 GET:cache-first,命中即回,未命中拉网并写入(带状态码检查)。
 *  - 版本号 CACHE_V 变更时,activate 阶段清掉旧缓存。
 */
const CACHE_V = "xydc-v0.34";
const PRECACHE = [
  "index.html",
  "css/style.css",
  "css/fx.css",
  "js/icons.js",
  "js/sound.js",
  "js/app.js",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "icons/apple-touch-icon.png",
  "icons/favicon-32.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_V);
    const base = new URL("./", self.registration.scope); // 兼容子路径托管(如 GitHub Pages 项目站)
    await Promise.all(PRECACHE.map(async (rel) => {
      try {
        const url = new URL(rel, base).href;
        const res = await fetch(url, { cache: "reload" }); // 绕过 HTTP 缓存拿最新
        if (res && res.ok) await cache.put(url, res.clone());
      } catch (e) { /* 单个资源失败不阻塞安装 */ }
    }));
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_V).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // 游戏零外部依赖,同源之外不接管

  // 归一化:去掉查询串(ASSET_V),按裸路径读写缓存
  const norm = url.href.replace(/\?.*$/, "");

  if (req.mode === "navigate") {
    // 页面导航:network-first,离线回落缓存的 index.html
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_V);
        cache.put(norm, fresh.clone());
        return fresh;
      } catch (e) {
        const cached = await caches.match(norm) || await caches.match(new URL("index.html", self.registration.scope).href);
        return cached || Response.error();
      }
    })());
    return;
  }

  // 静态资源:cache-first
  event.respondWith((async () => {
    const cached = await caches.match(norm);
    if (cached) return cached;
    try {
      const fresh = await fetch(req);
      if (fresh && fresh.ok) {
        const cache = await caches.open(CACHE_V);
        cache.put(norm, fresh.clone());
      }
      return fresh;
    } catch (e) {
      return Response.error();
    }
  })());
});
