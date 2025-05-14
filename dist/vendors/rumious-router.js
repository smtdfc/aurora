import { h as h$1, y, i as i$1 } from './rumious.js';

class r {
  constructor(t) {
    this.router = t;
  }
  onHashChange(t) {
    let e = new URL(t.newURL).hash.slice(1);
    "" === e && (e = "/"), this.router.resolve(e);
  }
  redirect(t, e = false) {
    const s = `#/${t.replace(/^\/+/, "")}`;
    if (e) {
      const e = new URL(window.location.href);
      e.hash = s, window.history.replaceState(null, "", e.toString()), this.router.resolve(t);
    } else window.location.hash = s;
  }
  start() {
    window.addEventListener("hashchange", this.onHashChange.bind(this));
    let t = new URL(window.location.href).hash.slice(1);
    "" === t && (t = "/"), this.router.resolve(t);
  }
}
class o {
  constructor(t) {
    this.router = t, this.onPopState = this.onPopState.bind(this);
  }
  onPopState(t) {
    const e = window.location.pathname.slice(1);
    this.router.resolve(e);
  }
  redirect(t, e = false) {
    const s = `/${t.replace(/^\/+/, "")}`;
    e ? (window.history.replaceState(null, "", s), this.router.resolve(t)) : window.history.pushState(null, "", s);
  }
  start() {
    window.addEventListener("popstate", this.onPopState);
    const t = window.location.pathname.slice(1);
    this.router.resolve(t);
  }
}
class i {
  currentPath = "";
  historyStack = [];
  historyIndex = -1;
  constructor(t) {
    this.router = t;
  }
  redirect(t, e = false) {
    const s = t.replace(/^\/+/, "");
    e && this.historyIndex >= 0 ? this.historyStack[this.historyIndex] = s : (this.historyStack = this.historyStack.slice(0, this.historyIndex + 1), this.historyStack.push(s), this.historyIndex++), this.currentPath = s, this.router.resolve(s);
  }
  start() {
    this.currentPath && this.router.resolve(this.currentPath);
  }
  getCurrentPath() {
    return this.currentPath;
  }
  back() {
    this.historyIndex > 0 && (this.historyIndex--, this.currentPath = this.historyStack[this.historyIndex], this.router.resolve(this.currentPath));
  }
  forward() {
    this.historyIndex < this.historyStack.length - 1 && (this.historyIndex++, this.currentPath = this.historyStack[this.historyIndex], this.router.resolve(this.currentPath));
  }
}
class h {
  constructor() {
    this.events = {
      page_loaded: [],
      not_found: [],
      not_allow: [],
      error: [],
      redirect: [],
      page_start_load: []
    };
  }
  on(t, e) {
    this.events[t] || (this.events[t] = []), this.events[t].push(e);
  }
  emit(t, e) {
    this.events[t] && this.events[t].forEach(t => t(e));
  }
  off(t, e) {
    this.events[t] && (this.events[t] = this.events[t].filter(t => t !== e));
  }
}
function n(t) {
  return "function" == typeof t && t.length > 0;
}
class a extends h$1 {
  constructor(t, s) {
    super(), this.app = t, this.configs = s, this.layouts = [], this.rootInject = y(document.createTextNode("")), this.event = new h(), this.layoutInstances = [this.rootInject], this.slugs = {}, this.query = new URLSearchParams(), this.routes = {}, this.currentPath = "", this.strategy = "hash" === s?.strategy ? new r(this) : "history" === s?.strategy ? new o(this) : "memory" === s?.strategy ? new i(this) : null;
  }
  match(t, e) {
    const s = this.routes[t];
    if (!s) return {
      isMatched: false,
      path: e
    };
    const r = [...t.matchAll(/:([^/]+)/g)].map(t => t[1]),
      o = t.replace(/:[^/]+/g, "([^/]+)").replace(/\*/g, ".*"),
      i = new RegExp(`^${o}$`),
      h = e.match(i);
    if (!h) return {
      isMatched: false,
      path: e
    };
    const n = {};
    return r.forEach((t, e) => {
      n[t] = h[e + 1];
    }), {
      isMatched: true,
      configs: s,
      slugs: n,
      path: e
    };
  }
  diffLayout(t) {
    for (let e = 0; e < Math.max(this.layouts.length, t.length); e++) if (this.layouts[e] !== t[e]) return e;
    return -1;
  }
  async resolve(t) {
    let r;
    const o = new URL(t, window.location.origin);
    for (let e in this.routes) {
      let s = this.match(e, t);
      if (s.isMatched) {
        r = s;
        break;
      }
    }
    if (!r) return void this.event.emit("not_found", {
      router: this,
      path: t
    });
    if (this.event.emit("page_start_load", r), r.configs?.protect && !r.configs?.protect(this)) return void this.event.emit("not_allow", {
      router: this,
      path: t
    });
    this.query = o.searchParams, this.slugs = r.slugs;
    const i = r.configs?.layouts || [],
      h = [];
    for (let t = 0; t < i.length; t++) {
      const e = i[t];
      n(e) ? h[t] = await e(this) : h[t] = e;
    }
    const a = await r.configs?.handler?.(this, r.slugs),
      c = this.diffLayout(h);
    if (-1 !== c) {
      this.layouts = h, this.layoutInstances = this.layoutInstances.slice(0, c + 1);
      for (let t = c; t < h.length; t++) {
        const o = y(document.createTextNode(""));
        this.layoutInstances[t + 1] = o;
        const i = i$1(h[t], {
          router: this,
          route: r,
          routeSlot: o
        });
        this.layoutInstances[t].set(i);
      }
    }
    this.layoutInstances[h.length] || (this.layoutInstances[h.length] = y(document.createTextNode("")));
    const u = i$1(a, {
      router: this,
      route: r,
      routeSlot: null
    });
    this.layoutInstances[h.length].set(u), this.event.emit("page_loaded", r);
  }
  route(t, e) {
    this.routes[t] = e;
  }
  addRoute(t, e, s) {
    this.routes[t] = {
      handler: e,
      layouts: s
    };
  }
  redirect(t, e = false) {
    if (!this.strategy) throw new Error("RumiousRouterModuleError: No routing strategy defined. Did you forget to pass configs ?");
    this.strategy.redirect(t, e), this.event.emit("redirect", {
      router: this,
      path: t,
      replace: e
    });
  }
  static init(t, e) {
    return new a(t, e);
  }
  start() {
    if (!this.strategy) throw new Error("RumiousRouterModuleError: No routing strategy defined. Did you forget to pass configs ?");
    this.strategy.start();
  }
}

export { a };
//# sourceMappingURL=rumious-router.js.map
