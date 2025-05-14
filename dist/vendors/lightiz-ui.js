class e {}
class t extends e {
  constructor(e) {
    super(), this.element = e;
  }
  static generator(e) {
    return new t(e);
  }
  open() {
    this.element.classList.add("open");
  }
  close() {
    this.element.classList.remove("open");
  }
  toggle() {
    this.element.classList.contains("open") ? this.close() : this.open();
  }
  action(e) {
    switch (e.type) {
      case "toggle":
        this.toggle();
        break;
      case "open":
        this.open();
        break;
      case "close":
        this.close();
        break;
      default:
        throw new Error("Unsupported action!");
    }
  }
}
function s(e, t = {}) {
  return e._lightiz_uiui || (e._lightiz_uiui = t), e._lightiz_uiui;
}
function i(e = "span", t = "") {
  const s = document.createElement(e);
  return s.className = t, document.body.appendChild(s), s;
}
Object.defineProperty(t, "name", {
  value: "navbar",
  writable: false,
  enumerable: true,
  configurable: true
});
class n extends e {
  constructor(e) {
    super(), this.element = e;
  }
  static generator(e) {
    return new n(e);
  }
  open() {
    this.element.classList.add("active");
  }
  close() {
    this.element.classList.remove("active");
  }
  toggle() {
    this.element.classList.contains("active") ? this.close() : this.open();
  }
  action(e) {
    switch (e.type) {
      case "toggle":
        this.toggle();
        break;
      case "open":
        this.open();
        break;
      case "close":
        this.close();
        break;
      default:
        throw new Error("Unsupported action!");
    }
  }
}
Object.defineProperty(n, "name", {
  value: "overlay",
  writable: false,
  enumerable: true,
  configurable: true
});
class a extends e {
  constructor(e) {
    super(), this.element = e, this.data = s(this.element, {
      overlay: new n(i("span", "overlay"))
    });
  }
  static generator(e) {
    return new a(e);
  }
  open() {
    this.element.classList.add("open"), this.data?.overlay?.open();
  }
  close() {
    this.element.classList.remove("open"), this.data?.overlay?.close();
  }
  toggle() {
    this.element.classList.contains("open") ? this.close() : this.open();
  }
  action(e) {
    switch (e.type) {
      case "toggle":
        this.toggle();
        break;
      case "open":
        this.open();
        break;
      case "close":
        this.close();
        break;
      default:
        throw new Error("Unsupported action!");
    }
  }
}
Object.defineProperty(a, "name", {
  value: "offcanvas",
  writable: false,
  enumerable: true,
  configurable: true
});
class r extends e {
  constructor(e) {
    super(), this.element = e;
  }
  static generator(e) {
    return new r(e);
  }
  open() {
    this.element.classList.add("open");
  }
  close() {
    this.element.classList.remove("open");
  }
  toggle() {
    this.element.classList.contains("open") ? this.close() : this.open();
  }
  action(e) {
    switch (e.type) {
      case "toggle":
        this.toggle();
        break;
      case "open":
        this.open();
        break;
      case "close":
        this.close();
        break;
      default:
        throw new Error("Unsupported action!");
    }
  }
}
Object.defineProperty(r, "name", {
  value: "sidebar",
  writable: false,
  enumerable: true,
  configurable: true
});
class o extends e {
  constructor(e) {
    super(), this.element = e;
  }
  static generator(e) {
    return new o(e);
  }
  open() {
    this.element.classList.add("open");
  }
  close() {
    this.element.classList.remove("open");
  }
  toggle() {
    this.element.classList.contains("open") ? this.close() : this.open();
  }
  action(e) {
    switch (e.type) {
      case "toggle":
        this.toggle();
        break;
      case "open":
        this.open();
        break;
      case "close":
        this.close();
        break;
      default:
        throw new Error("Unsupported action!");
    }
  }
}
Object.defineProperty(o, "name", {
  value: "accordion",
  writable: false,
  enumerable: true,
  configurable: true
});
class l extends e {
  overlay = null;
  constructor(e) {
    super(), this.element = e, this.contents = this.element.querySelector(".modal-content"), this.element.style.display = "none";
  }
  static generator(e) {
    return new l(e);
  }
  open() {
    this.element.classList.contains("active") || (this.overlay = document.createElement("div"), this.overlay.classList.add("modal-overlay"), this.element.prepend(this.overlay), this.overlay.addEventListener("click", e => {
      e.target === this.overlay && this.close();
    }), this.element.style.display = "block", requestAnimationFrame(() => {
      this.element.classList.add("active"), this.element.classList.remove("modal-hidden");
    }));
  }
  close() {
    this.element.classList.add("modal-hidden"), this.element.classList.remove("active");
    const e = () => {
      this.element.style.display = "none", this.element.classList.remove("modal-hidden"), this.overlay && (this.overlay.remove(), this.overlay = null), this.element.removeEventListener("animationend", e);
    };
    this.element.addEventListener("animationend", e);
  }
  toggle() {
    this.element.classList.contains("active") ? this.close() : this.open();
  }
  action(e) {
    switch (e.type) {
      case "toggle":
        this.toggle();
        break;
      case "open":
        this.open();
        break;
      case "close":
        this.close();
        break;
      default:
        throw new Error("Unsupported action!");
    }
  }
}
Object.defineProperty(l, "name", {
  value: "modal",
  writable: false,
  enumerable: true,
  configurable: true
});
class c extends e {
  constructor(e) {
    super(), this.element = e;
  }
  static generator(e) {
    return new c(e);
  }
  static create(e, t) {
    let s = document.createElement("div");
    return s.textContent = e, s.classList.add("toast", `toast-${t}`), this.generator(s);
  }
  show() {
    this.element.classList.add("show"), this.element.classList.remove("hide");
  }
  hide(e = false) {
    this.element.classList.remove("show"), this.element.classList.add("hide"), e && setTimeout(() => {
      this.element.remove();
    }, 500);
  }
  toggle() {
    this.element.classList.contains("show") ? this.hide() : this.show();
  }
  action(e) {
    switch (e.type) {
      case "toggle":
        this.toggle();
        break;
      case "show":
        this.show();
        break;
      case "hide":
        this.hide(...(e.options ?? []));
        break;
      default:
        throw new Error("Unsupported action!");
    }
  }
}
function h() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
}
Object.defineProperty(c, "name", {
  value: "toast",
  writable: false,
  enumerable: true,
  configurable: true
});
class d extends e {
  constructor(e) {
    super(), this.element = e, this.indicator = this.element.querySelector(".tab-indicator") ?? i("div", "tab-indicator"), this.metadata = s(this.element, {
      id: h(),
      isObserve: false,
      activeItem: this.getActiveItem() ?? i("div", "tab"),
      index: 0
    }), this.metadata.isObserve || this._setup();
  }
  static generator(e) {
    return new d(e);
  }
  _setup() {
    new MutationObserver(e => {
      e.forEach(e => {
        e.addedNodes.forEach(e => {
          e.classList?.contains("tab") && this.updateIndicator(this.metadata.activeItem);
        });
      });
    }).observe(this.element, {
      childList: true
    });
  }
  updateIndicator(e = i("div")) {
    const t = this.element.getBoundingClientRect(),
      s = e.getBoundingClientRect(),
      n = s.left - t.left + this.element.scrollLeft,
      a = s.width;
    this.indicator.style.left = n + "px", this.indicator.style.width = a + "px";
  }
  getActiveItem() {
    for (let e of Array.from(this.element.children)) if (e.classList.contains("active")) return e;
    return null;
  }
  inactiveAll() {
    Array.from(this.element.children).forEach(e => {
      e.classList.remove("active"), e.dataset.panel && document.querySelector(e.dataset.panel)?.classList.remove("active");
    });
  }
  setTabByIndex(e, t = false) {
    (this.metadata.index !== e || t) && (this.metadata.index = e, this.active(this.element.children[e]));
  }
  active(e) {
    this.inactiveAll(), this.metadata.activeItem = e, this.updateIndicator(e), e.classList.add("active"), e.dataset.panel && document.querySelector(e.dataset.panel)?.classList.add("active");
  }
  action(e) {
    if ("active" !== e.type) throw new Error("Unsupported action!");
    this.active(e.trigger);
  }
}
Object.defineProperty(d, "name", {
  value: "tab",
  writable: false,
  enumerable: true,
  configurable: true
});
class u extends e {
  constructor(e) {
    super(), this.element = e, this.data = s(this.element, {
      current: parseFloat(getComputedStyle(this.element).getPropertyValue("--progress-bar-value").replace("%", "")) || 0
    });
  }
  static generator(e) {
    return new u(e);
  }
  updateText() {
    this.element.classList.contains("progree-bar-text") ? (this.element.querySelector(".progress-bar") ?? i("div", "progress-bar")).textContent = `${this.data.current} %` : (this.element.querySelector(".progress-bar") ?? i("div", "progress-bar")).textContent = "0";
  }
  increase(e) {
    this.data.current += e, this.element.style.setProperty("--progress-bar-value", `${this.data.current}%`);
  }
  decrease(e) {
    this.data.current -= e, this.element.style.setProperty("--progress-bar-value", `${this.data.current}%`);
  }
  set(e) {
    this.data.current = e, this.element.style.setProperty("--progress-bar-value", `${this.data.current}%`);
  }
  action(e) {
    switch (e.type) {
      case "increase":
        this.increase(parseInt(e.options[0]) || 1);
        break;
      case "set":
        this.set(parseInt(e.options[0]) || 0);
        break;
      case "decrease":
        this.decrease(parseInt(e.options[0]) || 1);
        break;
      default:
        throw new Error("Unsupported action!");
    }
  }
}
Object.defineProperty(u, "name", {
  value: "progressbar",
  writable: false,
  enumerable: true,
  configurable: true
});
var p = Object.freeze({
  __proto__: null,
  LightizUIAccordion: o,
  LightizUIComponent: e,
  LightizUIModal: l,
  LightizUINavbar: t,
  LightizUIOffcanvas: a,
  LightizUIOverlay: n,
  LightizUIProgressBar: u,
  LightizUISidebar: r,
  LightizUITab: d,
  LightizUIToast: c
});
window.addEventListener("click", function (e) {
  let t = e.target;
  if (t.classList.contains("sub-menu")) t.classList.toggle("open");else if ("a" === t.tagName.toLowerCase()) {
    let e = t.closest(".sub-menu");
    e && e.classList.toggle("open");
  }
}), window.addEventListener("load", () => {
  document.querySelectorAll(".tabs-container").forEach(e => {
    let t = new d(e);
    t.active(t.getActiveItem() || i("div"));
  });
});
var m = Object.freeze({
  __proto__: null
});
class g {
  constructor(e, t = {}) {
    this.app = e, this.options = t, this.initListener();
  }
  initListener() {
    window.addEventListener("click", e => {
      const t = e.target,
        s = t.dataset;
      if (s.ui) {
        const e = function (e) {
          const t = e.split(":");
          if (t.length < 3) return null;
          const [s, i, n, ...a] = t;
          return {
            action: s,
            componentType: i,
            target: n,
            options: a
          };
        }(s.ui);
        if (!e) return;
        const {
            target: i,
            action: n,
            componentType: a,
            options: r
          } = e,
          o = document.querySelector(i),
          l = function (e) {
            for (let t in p) {
              const s = p[t];
              if (s?.name === e) return s;
            }
            return null;
          }(a);
        if (!l) return;
        l.generator(o, r).action({
          type: n,
          trigger: t,
          target: o,
          component: l,
          options: r
        });
      }
    });
  }
  static init(e, t = {}) {
    return new g(e, t);
  }
}
var b = Object.freeze({
  __proto__: null,
  LightizUIModule: g
});
class v {
  static containerID = `lightiz_uiui_${h()}`;
  static ensureContainer() {
    let e = document.getElementById(v.containerID);
    return e || (e = document.createElement("div"), e.className = "toast-container", e.setAttribute("id", v.containerID), document.body.appendChild(e)), e;
  }
  static show(e, t = {}) {
    let s = this.ensureContainer(),
      i = c.create(e, t.type ?? "primary");
    s.appendChild(i.element), i.show(), setTimeout(() => {
      i.hide(t.remove);
    }, t.duration ?? 5e3);
  }
}
var w = Object.freeze({
  __proto__: null,
  ToastGenerator: v
});
window.LightizUI = {
  ...p,
  ...m,
  ...b,
  ...w
};

export { l };
//# sourceMappingURL=lightiz-ui.js.map
