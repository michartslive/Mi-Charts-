export default {
  async fetch(req, env) {
    const u = new URL(req.url);
    if (u.pathname.startsWith("/td/")) {
      const json = (o, s) => new Response(JSON.stringify(o), { status: s || 200, headers: { "Content-Type": "application/json" } });
      if (!env.TD_KEY) return json({ status: "error", code: 400, message: "TD_KEY secret is missing" });
      const target = "https://api.twelvedata.com/" + u.pathname.slice(4) + u.search + (u.search ? "&" : "?") + "apikey=" + env.TD_KEY;
      const r = await fetch(target, { cf: { cacheTtl: 20, cacheEverything: true } });
      return new Response(r.body, { status: r.status, headers: { "Content-Type": "application/json" } });
    }
    return env.ASSETS.fetch(req);
  }
};
