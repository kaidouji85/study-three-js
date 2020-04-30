import * as Core from 'workbox-core';
import * as Routing from 'workbox-routing';
import * as Strategies from 'workbox-strategies';

Routing.registerRoute(
  /\.(?:html|js|css)$/,
  new Strategies.NetworkFirst()
);

const CACHE_FIRST_NAME = `CACHE_FIRST_NAME_${BUILD_HASH}`;
Routing.registerRoute(
  /\.(?:png|glb|json)$/,
  new Strategies.CacheFirst({
    cacheName: CACHE_FIRST_NAME
  })
);

self.addEventListener('activate', e => {
  e.waitUntil(clearOldRuntimeCache());
});

/** 古いランタイムキャッシュを削除する */
async function clearOldRuntimeCache() {
  try {
    const keys = await caches.keys();
    const deleteKeys = keys
      .filter(v => v !== CACHE_FIRST_NAME)
      .filter(v => v!== Core.cacheNames.precache);
    await Promise.all(deleteKeys.map(v => {
      console.log(`delete cache ${v}`);
      return caches.delete(v);
    }
    ));
  } catch(e) {
    throw e;
  }
}