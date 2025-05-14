import { c as create } from './mutative.js';

class e {
  constructor(t, e) {
    this.target = t, this.app = e, this.onRenderFinished = [];
  }
  findName(t) {
    return this.target[t];
  }
}
function n(t, e, s) {
  let r = e.generator.bind(t.target);
  t.renderHelper = n, r(s, t), setTimeout(async () => {
    const e = [...t.onRenderFinished];
    t.onRenderFinished = [];
    for (const t of e) await t();
  }, 0);
}
class s {
  static classNames = "";
  static tagName = "rumious-component";
  constructor() {
    this.renderOptions = {
      mode: "idle"
    };
  }
  warp(t, e) {
    let s = document.createDocumentFragment();
    n(this.context, t, s);
    let r = Date.now().toString(32),
      i = document.createElement("r-wrap");
    return i.id = `r-wrap-${r}`, i.appendChild(s), e.appendChild(i), {
      id: r,
      remove: () => i.remove(),
      target: e
    };
  }
  render(t) {
    let e = document.createDocumentFragment();
    return n(this.context, t, e), e;
  }
  onCreate() {}
  onRender() {}
  onDestroy() {}
  async onBeforeRender() {}
  prepare(t, n) {
    this.props = n, this.context = new e(this, t.app);
  }
  async requestRender() {
    await this.onBeforeRender();
    let t = this.template();
    n(this.context, t, this.element), this.onRender();
  }
  requestCleanup() {}
}
class r extends HTMLElement {
  constructor() {
    super(), this.props = {};
  }
  setContext(t) {
    this.context = t;
  }
  setComponent(t) {
    this.componentConstructor = t;
  }
  setup(t, e) {
    this.context = t, this.componentConstructor = e;
  }
  connectedCallback() {
    this.componentConstructor ? (this.componentInstance = new this.componentConstructor(), this.componentInstance.element = this, this.componentConstructor.classNames && (this.className = this.componentConstructor.classNames), this.componentInstance.prepare(this.context, this.props), this.componentInstance.onCreate(), this.componentInstance.requestRender()) : console.warn("Rumious: Cannot find matching component constructor.");
  }
  disconnectedCallback() {
    this.componentInstance?.onDestroy();
  }
}
function i(t, e) {
  let n = window.RUMIOUS_JSX.createComponent(t);
  return n.props = e, n.setComponent(t), n;
}
class o {
  constructor(t, n = {}) {
    this.root = t, this.options = n, this.modules = [], this.context = new e(this, this);
  }
  addModule(t, e) {
    const n = t.init(this, e);
    return this.modules.push(n), n;
  }
  render(t) {
    n(this.context, t, this.root);
  }
}
function a(t, e) {
  return new o(t, e);
}
class h {}
class l {
  constructor(t) {
    this.generator = t;
  }
}
class c {
  constructor(t) {
    if (this.contents = t, this.targets = new Map(), !t || 0 === t.length) throw new Error("Injector must be initialized with non-empty content");
    const e = t[0];
    this.type = "string" == typeof e ? "string" : "element";
  }
  commit(t) {
    this.contents = t;
    const e = t[0];
    this.type = "string" == typeof e ? "string" : "element";
  }
  addTarget(t) {
    this.targets.set(t, 1);
  }
  inject(t) {
    if (this.targets.has(t) && this.contents) if (t.innerHTML = "", "string" === this.type) for (const e of this.contents) t.insertAdjacentHTML("beforeend", e);else for (const e of this.contents) t.appendChild(e);
  }
  injectAll() {
    for (const t of this.targets.keys()) this.inject(t);
  }
  removeTarget(t) {
    this.targets.delete(t);
  }
  clear() {
    this.targets.clear();
  }
}
function u(t) {
  return new c([t]);
}
class d {
  constructor(t) {
    this.target = t;
  }
  getElement() {
    return this.target;
  }
  remove() {
    this.target.remove();
  }
  addChild(t) {
    this.target.appendChild(t);
  }
  listChild() {
    return this.target.childNodes;
  }
  querySelector(t) {
    return this.target.querySelector(t);
  }
  querySelectorAll(t) {
    return this.target.querySelectorAll(t);
  }
  set text(t) {
    this.target.textContent = t;
  }
  get text() {
    return this.target.textContent;
  }
  set value(t) {
    (this.target instanceof HTMLInputElement || this.target instanceof HTMLTextAreaElement) && (this.target.value = t);
  }
  get value() {
    if (this.target instanceof HTMLInputElement || this.target instanceof HTMLTextAreaElement) return this.target.value;
  }
  addClassName(t) {
    this.target.classList.add(t);
  }
  removeClassName(t) {
    this.target.classList.remove(t);
  }
  hasClassName(t) {
    return this.target.classList.contains(t);
  }
  toggleClass(t, e) {
    return this.target.classList.toggle(t, e);
  }
  setStyle(t) {
    Object.assign(this.target.style, t);
  }
  getStyle(t) {
    return getComputedStyle(this.target).getPropertyValue(t);
  }
  setAttribute(t, e) {
    this.target.setAttribute(t, e);
  }
  getAttribute(t) {
    return this.target.getAttribute(t);
  }
  removeAttribute(t) {
    this.target.removeAttribute(t);
  }
  on(t, e, n) {
    this.target.addEventListener(t, e, n);
  }
  off(t, e, n) {
    this.target.removeEventListener(t, e, n);
  }
  set html(t) {
    this.target.innerHTML = t;
  }
  get html() {
    return this.target.innerHTML;
  }
  getBoundingRect() {
    return this.target.getBoundingClientRect();
  }
  isInViewport() {
    const t = this.target.getBoundingClientRect();
    return t.top >= 0 && t.left >= 0 && t.bottom <= (window.innerHeight || document.documentElement.clientHeight) && t.right <= (window.innerWidth || document.documentElement.clientWidth);
  }
  prependChild(t) {
    this.target.prepend(t);
  }
  setDisabled(t) {
    (this.target instanceof HTMLButtonElement || this.target instanceof HTMLInputElement || this.target instanceof HTMLTextAreaElement) && (this.target.disabled = t);
  }
  addClasses(...t) {
    this.target.classList.add(...t);
  }
  removeClasses(...t) {
    this.target.classList.remove(...t);
  }
  replaceClass(t, e) {
    this.target.classList.replace(t, e);
  }
  moveTo(t) {
    t.appendChild(this.target);
  }
  getParent() {
    return this.target.parentElement;
  }
  getNextSibling() {
    return this.target.nextElementSibling;
  }
  getPreviousSibling() {
    return this.target.previousElementSibling;
  }
  hide() {
    this.target.style.display = "none";
  }
  show() {
    this.target.style.removeProperty("display");
  }
  isHidden() {
    return "none" === window.getComputedStyle(this.target).display;
  }
  scrollIntoView(t = {
    behavior: "smooth"
  }) {
    this.target.scrollIntoView(t);
  }
  matches(t) {
    return this.target.matches(t);
  }
  getChildren() {
    return Array.from(this.target.children);
  }
  insertAfter(t) {
    this.target.parentNode && this.target.parentNode.insertBefore(t, this.target.nextSibling);
  }
  insertBefore(t) {
    this.target.parentNode && this.target.parentNode.insertBefore(t, this.target);
  }
  clearChildren() {
    for (; this.target.firstChild;) this.target.removeChild(this.target.firstChild);
  }
  animate(t, e) {
    return this.target.animate(t, e);
  }
}
function g() {
  return new d(document.createElement("span"));
}
function m(t) {
  const e = t.indexOf("$");
  return -1 !== e ? t.slice(e + 1) : "";
}
class p {
  constructor(t) {
    this.target = t, this.bindings = [];
  }
  addBinding(t) {
    this.bindings.push(t);
  }
  removeBinding(t) {
    this.bindings = this.bindings.filter(e => e !== t);
  }
  async emit(t) {
    await Promise.allSettled(this.bindings.map(e => {
      try {
        const n = e(t);
        return n instanceof Promise ? n : Promise.resolve(n);
      } catch (t) {
        return Promise.reject(t);
      }
    }));
  }
}
class f {
  constructor(t, e) {
    this.value = t, this.reactor = e ?? new p(this);
  }
  set(t) {
    this.value = t, this.reactor.emit({
      type: "SET",
      target: this,
      value: t
    });
  }
  get() {
    return this.value;
  }
  increase(t = 1) {
    "number" == typeof this.value && this.set(this.value + t);
  }
  produce(e) {
    const [n, s] = create(this.value);
    e(n), this.set(s());
  }
}
function y(t) {
  return new f(t);
}
const C = {
  on: function (t, e, n, s) {
    "string" == typeof s && (s = t.findName(m(s))), e.addEventListener(n, s);
  },
  ref: function (t, e, n, s) {
    if ("string" == typeof s && (s = t.findName(m(s))), !(s instanceof d)) throw Error("Rumious: ref directive required RumiousElementRef !");
    s.target = e;
  },
  inject: function (t, e, n, s) {
    if ("string" == typeof s && (s = t.findName(m(s))), !(s instanceof c)) throw Error("Rumious: inject directive required RumiousInjector !");
    s.addTarget(e), s.inject(e);
  },
  bind: function (t, e, n, s) {
    if ("string" == typeof s && (s = t.findName(m(s))), !(s instanceof f)) throw Error("Rumious: bind directive requires RumiousState!");
    {
      const t = {
        text: (t, e) => e.textContent = t,
        html: (t, e) => e.innerHTML = t,
        value: (t, e) => e.value = t,
        class: (t, e) => e.className = t,
        style: (t, e) => e.style.cssText = t,
        checked: (t, e) => e.checked = t,
        disabled: (t, e) => {
          "disabled" in e && (e.disabled = t);
        },
        readonly: (t, e) => e.readOnly = t,
        required: (t, e) => e.required = t,
        selected: (t, e) => e.selected = t,
        src: (t, e) => e.src = t,
        href: (t, e) => e.href = t,
        placeholder: (t, e) => e.placeholder = t,
        title: (t, e) => e.title = t,
        show: (t, e) => e.style.display = t ? "" : "none",
        hide: (t, e) => e.style.display = t ? "none" : ""
      }[n] ?? ((t, e) => e.setAttribute(n, t));
      t(s.value, e), s.reactor.addBinding(() => t(s.value, e));
    }
  },
  model: function (t, e, n, s) {
    if ("string" == typeof s && (s = t.findName(m(s))), !(s instanceof f && (e instanceof HTMLInputElement || e instanceof HTMLSelectElement || e instanceof HTMLTextAreaElement))) throw Error("Rumious: model directive requires RumiousState and a valid form element!");
    {
      const t = e.type;
      e.addEventListener("input", () => {
        if (e instanceof HTMLInputElement) switch (t) {
          case "checkbox":
            s.set(e.checked);
            break;
          case "radio":
            e.checked && s.set(e.value);
            break;
          default:
            s.set(e.value);
        } else (e instanceof HTMLSelectElement || e instanceof HTMLTextAreaElement) && s.set(e.value);
      });
    }
  }
};
class w {
  constructor(t, e) {
    this.state = t, this.callback = e;
  }
  prepare(t, e) {
    this.anchorElement = t, this.context = e;
  }
  renderItem(t, e) {
    const n = document.createDocumentFragment(),
      s = this.callback(t, e);
    return this.context.renderHelper(this.context, s, n), n;
  }
  scheduleRenderAll() {
    requestAnimationFrame(() => this.renderAll());
  }
  async render() {
    this.state.reactor.addBinding(this.onStateChange.bind(this)), this.scheduleRenderAll();
  }
  renderAll() {
    const t = document.createDocumentFragment();
    this.state.value.forEach((e, n) => {
      t.appendChild(this.renderItem(e, n));
    }), this.anchorElement.replaceChildren(t);
  }
  updateElement(t, e) {
    const n = this.anchorElement.children[t];
    n && this.anchorElement.replaceChild(this.renderItem(e, t), n);
  }
  insertOrAppendElement(t, e) {
    const n = this.renderItem(t, e),
      s = this.anchorElement.children[e];
    s ? this.anchorElement.insertBefore(n, s) : this.anchorElement.appendChild(n);
  }
  removeElement(t) {
    this.anchorElement.children[t]?.remove();
  }
  appendElement(t, e) {
    if (Array.isArray(t)) {
      const n = document.createDocumentFragment();
      t.forEach((t, s) => {
        n.appendChild(this.renderItem(t, e + s));
      }), this.anchorElement.replaceChildren(n), this.anchorElement.appendChild(n);
    }
  }
  async onStateChange(t) {
    if (document.contains(this.anchorElement)) switch (t.type) {
      case "SET":
      default:
        this.scheduleRenderAll();
        break;
      case "SET_BY_KEY":
        this.updateElement(t.key, t.value);
        break;
      case "REMOVE_BY_KEY":
        this.removeElement(t.key);
        break;
      case "INSERT_BY_KEY":
        this.insertOrAppendElement(t.value, t.key);
        break;
      case "APPEND":
        this.appendElement(t.value, this.state.value.length - t.value.length);
        break;
      case "PREPEND":
        this.anchorElement.prepend(this.renderItem(t.value, 0));
    } else this.state.reactor.removeBinding(this.onStateChange.bind(this));
  }
}
function x(t) {
  return t !== Object(t);
}
async function A(t, e, n, s) {
  if (e.parentNode) if (x(n)) !function (t, e) {
    t.textContent = String(e);
  }(e, n);else if (n instanceof f && n.value instanceof Node) !function (t, e, n) {
    let s = t;
    const i = () => {
      if (!document.contains(s)) return void e.reactor.removeBinding(i);
      const t = e.value;
      t instanceof r && t.setContext(n), s.parentNode?.replaceChild(t, s), s = t;
    };
    i(), e.reactor.addBinding(i);
  }(e, n, s);else if (n instanceof f) !function (t, e) {
    const n = () => {
      document.contains(t) ? t.textContent = String(e.value) : e.reactor.removeBinding(n);
    };
    n(), e.reactor.addBinding(n);
  }(e, n);else if (Array.isArray(n)) !function (t, e, n) {
    const s = document.createDocumentFragment();
    for (const t of e) t instanceof l ? n.renderHelper?.(n, t, s) : x(t) ? s.appendChild(document.createTextNode(String(t))) : t instanceof Node && s.appendChild(t.cloneNode(true));
    t.replaceWith(s);
  }(e, n, s);else if (n instanceof w) n.prepare(e.parentElement, s), n.render(), e.remove();else if (n instanceof HTMLElement) e.replaceWith(n);else if (n instanceof l) !function (t, e, n) {
    const s = document.createDocumentFragment();
    n.renderHelper?.(n, e, s), t.replaceWith(s);
  }(e, n, s);else if (n instanceof NodeList || n instanceof HTMLCollection) n.length > 0 ? function (t, e) {
    const n = document.createDocumentFragment();
    for (const t of Array.from(e)) n.appendChild(t.cloneNode(true));
    t.replaceWith(n);
  }(e, n) : e.remove();else if (n && "function" == typeof n.toString) try {
    e.textContent = n.toString();
  } catch {
    e.textContent = "";
  } else e.textContent = "";
}
function R(t) {
  return new l(t);
}
window.RUMIOUS_JSX = {
  template: R,
  createElement: function (...t) {
    throw console.log(t), Error("Rumious doesn't use createElement !");
  },
  addDirective: function (t, e, n, s = "", r) {
    let i = C[n];
    if (!i) throw Error("Rumious: Cannot solve directive !");
    i(e, t, s, r);
  },
  dynamicValue: function (t, e, n, s) {
    A(0, e, n, s);
  },
  createComponent: function (t) {
    let e = t.tagName;
    return window.customElements.get(e) || window.customElements.define(e, class extends r {
      static tag = e;
    }), document.createElement(e);
  }
};
window.RUMIOUS_CONTEXTS = {};
class I {
  constructor(t = {}) {
    this.events = {}, this.values = t;
  }
  has(t) {
    return t in this.values;
  }
  set(t, e) {
    this.values[t] = e;
  }
  get(t) {
    return this.values[t];
  }
  on(t, e) {
    this.events[t] || (this.events[t] = []), this.events[t].push(e);
  }
  off(t, e) {
    this.events[t] && (this.events[t] = this.events[t].filter(t => t !== e));
  }
  emit(t, e) {
    this.events[t] && this.events[t].forEach(t => t(e));
  }
}
function _(t, e = function (t = "_") {
  return `${t}${(Math.floor(9999 * Math.random()) * Date.now()).toString(32)}`;
}("rctx_")) {
  if (window.RUMIOUS_CONTEXTS[e]) return window.RUMIOUS_CONTEXTS[e];
  {
    let n = new I(t);
    return window.RUMIOUS_CONTEXTS[e] = n, n;
  }
}

export { _, a, g, h, i, s, u, y };
//# sourceMappingURL=rumious.js.map
