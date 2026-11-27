const CACHE='mi-charts-v7';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-180.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())); });
// App files: serve instantly from the phone, refresh quietly in the background (saves data, opens fast).
self.addEventListener('fetch',e=>{
  const r=e.request, u=new URL(r.url);
  if(r.method!=='GET' || u.origin!==location.origin || u.pathname.indexOf('/td/')>-1) return;
  e.respondWith(caches.open(CACHE).then(c=>c.match(r,{ignoreSearch:true}).then(m=>{
    const net=fetch(r).then(res=>{ if(res&&res.ok) c.put(r,res.clone()); return res; }).catch(()=>m||c.match('index.html'));
    return m||net;
  })));
});
