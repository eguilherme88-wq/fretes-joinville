'use strict';
const PREFIXO='fretes-jv-'+new URL(self.registration.scope).pathname.replace(/[^a-z0-9]/gi,'_')+'-';
const CACHE=PREFIXO+'app-v1';
const ARQUIVOS=['./','./index.html','./app.css','./app.js','./backup.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ARQUIVOS))));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIXO)&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('message',event=>{if(event.data?.type==='ATIVAR_ATUALIZACAO')self.skipWaiting();});
self.addEventListener('fetch',event=>{const req=event.request,url=new URL(req.url),base=new URL(self.registration.scope);if(req.method!=='GET'||url.origin!==base.origin||url.search)return;const caminhos=ARQUIVOS.map(a=>new URL(a,base).pathname);if(!caminhos.includes(url.pathname))return;event.respondWith((async()=>{const cache=await caches.open(CACHE);if(req.mode==='navigate'){try{const resposta=await fetch(req);if(resposta.ok)await cache.put(req,resposta.clone());return resposta;}catch(e){return await cache.match(req)||await cache.match(new URL('./index.html',base).href)||Response.error();}}return await cache.match(req)||fetch(req);})());});
