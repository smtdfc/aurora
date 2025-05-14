import { s, g, y, u, _ } from '../vendors/rumious.js';
import { l } from '../vendors/lightiz-ui.js';
import { l as lookup } from '../vendors/socket.io-client.js';
import '../vendors/mutative.js';
import '../vendors/engine.io-client.js';
import '../vendors/engine.io-parser.js';
import '../vendors/@socket.io/component-emitter.js';
import '../vendors/socket.io-parser.js';

class EmptyPlaceholder extends s {
  static tagName = "aurora-empty-placeholder";
  template() {
    return window.RUMIOUS_JSX.template(function (_rumious_root_3b18c956, _rumious_ctx_3b7d4664) {
      const _rumious_el = document.createElement("div");
      _rumious_el.setAttribute("class", "empty-state d-flex flex-col align-center justify-center p-4 text-muted");
      _rumious_el.appendChild(document.createTextNode("\n        "));
      const _rumious_el2 = document.createElement("i");
      _rumious_el2.setAttribute("class", "material-icons mb-2");
      _rumious_el2.setAttribute("style", "font-size: 48px;");
      const _rumious_dymanic_ = document.createTextNode("");
      _rumious_el2.appendChild(_rumious_dymanic_);
      window.RUMIOUS_JSX.dynamicValue(_rumious_el2, _rumious_dymanic_, this.props.icon ?? "inbox", _rumious_ctx_3b7d4664);
      _rumious_el.appendChild(_rumious_el2);
      _rumious_el.appendChild(document.createTextNode("\n        "));
      const _rumious_el3 = document.createElement("p");
      const _rumious_dymanic_2 = document.createTextNode("");
      _rumious_el3.appendChild(_rumious_dymanic_2);
      window.RUMIOUS_JSX.dynamicValue(_rumious_el3, _rumious_dymanic_2, this.props.content ?? "No content here", _rumious_ctx_3b7d4664);
      _rumious_el.appendChild(_rumious_el3);
      _rumious_el.appendChild(document.createTextNode("\n      "));
      _rumious_root_3b18c956.appendChild(_rumious_el);
      return _rumious_root_3b18c956;
    });
  }
}

const socket = lookup(undefined);
socket.on('connect', () => {
  console.log('Socket connected:', socket.id);
});
socket.on('disconnect', () => {
  console.log('Socket disconnected');
});
class SocketService {
  static sendMsg(topic, data) {
    socket.emit(topic, data);
  }
  static listen(topic, callback) {
    socket.on(topic, callback);
  }
  static unlisten(topic, callback) {
    socket.off(topic, callback);
  }
}

class ChatService {
  static initChat(context, user) {
    return new Promise(resolve => {
      const onSuccess = () => {
        SocketService.unlisten('chat:init:success', onSuccess);
        SocketService.unlisten('chat:init:error', onError);
        resolve(true);
      };
      const onError = () => {
        SocketService.unlisten('chat:init:success', onSuccess);
        SocketService.unlisten('chat:init:error', onError);
        resolve(false);
      };
      SocketService.listen('chat:init:success', onSuccess);
      SocketService.listen('chat:init:error', onError);
      SocketService.sendMsg('chat:init', {
        user
      });
    });
  }
  static async listenMsg(context) {
    SocketService.listen('chat:send:error', data => {
      context.emit('error', data);
    });
    SocketService.listen('chat:reply', chatData => {
      context.get('messages').push(chatData);
      context.emit('msg', chatData);
    });
    SocketService.listen('chat:canvas:mode:change', ({
      mode
    }) => {
      this.changeCanvas(context, mode);
    });
    SocketService.listen("chat:canvas:read", () => context.emit("canvas:read", {}));
    SocketService.listen("chat:canvas:write", commit => context.emit("canvas:write", commit));
    context.on('canvas:content', data => SocketService.sendMsg('chat:canvas:content', data));
  }
  static async sendMsgText(context, sender, text) {
    const chatData = {
      id: Date.now().toString(32),
      sender,
      contents: typeof text === 'string' ? [text] : text
    };
    context.get('messages').push(chatData);
    context.emit('msg', chatData);
    SocketService.sendMsg('chat:send', chatData);
    return true;
  }
  static async changeCanvas(context, mode) {
    context.get("canvas").mode = mode;
    context.emit('canvas:mode:change', mode);
  }
}

const CANVAS_MODES = {
  "graphic": "Graphic Canvas",
  "text": "Text Canvas"
};
class SelectCanvasModeModal extends s {
  static tagName = "aurora-add-object-modal";
  modalRef = g();
  currentType = y("graphic");
  getModal() {
    return new l(this.modalRef.target);
  }
  closeModal() {
    this.getModal().close();
    setTimeout(() => this.element.remove(), 3000);
  }
  onRender() {
    this.getModal().open();
  }
  onDoneBtnClick() {
    ChatService.changeCanvas(this.props.context, this.currentType.value);
    this.closeModal();
  }
  template() {
    return window.RUMIOUS_JSX.template(function (_rumious_root_324a6a64, _rumious_ctx_5deb58a9) {
      const _rumious_frag = document.createDocumentFragment();
      _rumious_frag.appendChild(document.createTextNode("\n        "));
      const _rumious_el = document.createElement("div");
      _rumious_el.setAttribute("class", "modal");
      window.RUMIOUS_JSX.addDirective(_rumious_el, _rumious_ctx_5deb58a9, "ref", "standalone", this.modalRef);
      _rumious_el.appendChild(document.createTextNode("\n          "));
      const _rumious_el2 = document.createElement("div");
      _rumious_el2.setAttribute("class", "modal-content");
      _rumious_el2.appendChild(document.createTextNode("\n            "));
      const _rumious_el3 = document.createElement("div");
      _rumious_el3.setAttribute("class", "modal-header");
      _rumious_el3.appendChild(document.createTextNode("\n              "));
      const _rumious_el4 = document.createElement("h3");
      _rumious_el4.setAttribute("class", "modal-title");
      _rumious_el4.appendChild(document.createTextNode("Select canvas mode"));
      _rumious_el3.appendChild(_rumious_el4);
      _rumious_el3.appendChild(document.createTextNode("\n              "));
      const _rumious_el5 = document.createElement("button");
      window.RUMIOUS_JSX.addDirective(_rumious_el5, _rumious_ctx_5deb58a9, "on", "click", () => this.closeModal());
      _rumious_el5.setAttribute("class", "ml-auto btn btn-icon material-icons");
      _rumious_el5.appendChild(document.createTextNode("close"));
      _rumious_el3.appendChild(_rumious_el5);
      _rumious_el3.appendChild(document.createTextNode("\n            "));
      _rumious_el2.appendChild(_rumious_el3);
      _rumious_el2.appendChild(document.createTextNode("\n            "));
      const _rumious_el6 = document.createElement("div");
      _rumious_el6.setAttribute("class", "modal-body");
      _rumious_el6.appendChild(document.createTextNode("\n              "));
      const _rumious_el7 = document.createElement("div");
      _rumious_el7.setAttribute("class", "form-group m-0");
      _rumious_el7.appendChild(document.createTextNode("\n                "));
      const _rumious_el8 = document.createElement("label");
      _rumious_el8.setAttribute("class", "form-label");
      _rumious_el8.appendChild(document.createTextNode("Mode:"));
      _rumious_el7.appendChild(_rumious_el8);
      _rumious_el7.appendChild(document.createTextNode("\n                "));
      const _rumious_el9 = document.createElement("select");
      _rumious_el9.setAttribute("class", "form-select");
      window.RUMIOUS_JSX.addDirective(_rumious_el9, _rumious_ctx_5deb58a9, "model", "standalone", this.currentType);
      _rumious_el9.appendChild(document.createTextNode("\n                  "));
      const _rumious_dymanic_ = document.createTextNode("");
      _rumious_el9.appendChild(_rumious_dymanic_);
      window.RUMIOUS_JSX.dynamicValue(_rumious_el9, _rumious_dymanic_, Object.entries(CANVAS_MODES).map(([key, label]) => window.RUMIOUS_JSX.template(function (_rumious_root_89f6f9cc, _rumious_ctx_a1888aeb) {
        const _rumious_el13 = document.createElement("option");
        _rumious_el13.setAttribute("value", key);
        const _rumious_dymanic_2 = document.createTextNode("");
        _rumious_el13.appendChild(_rumious_dymanic_2);
        window.RUMIOUS_JSX.dynamicValue(_rumious_el13, _rumious_dymanic_2, label, _rumious_ctx_a1888aeb);
        _rumious_root_89f6f9cc.appendChild(_rumious_el13);
        return _rumious_root_89f6f9cc;
      })), _rumious_ctx_5deb58a9);
      _rumious_el9.appendChild(document.createTextNode("\n                "));
      _rumious_el7.appendChild(_rumious_el9);
      _rumious_el7.appendChild(document.createTextNode("\n              "));
      _rumious_el6.appendChild(_rumious_el7);
      _rumious_el6.appendChild(document.createTextNode("\n              "));
      const _rumious_el10 = document.createElement("br");
      _rumious_el6.appendChild(_rumious_el10);
      _rumious_el6.appendChild(document.createTextNode("\n            "));
      _rumious_el2.appendChild(_rumious_el6);
      _rumious_el2.appendChild(document.createTextNode("\n            "));
      const _rumious_el11 = document.createElement("div");
      _rumious_el11.setAttribute("class", "modal-footer p-5");
      _rumious_el11.appendChild(document.createTextNode("\n              "));
      const _rumious_el12 = document.createElement("button");
      window.RUMIOUS_JSX.addDirective(_rumious_el12, _rumious_ctx_5deb58a9, "on", "click", () => this.onDoneBtnClick());
      _rumious_el12.setAttribute("class", "ml-auto btn btn-primary");
      _rumious_el12.appendChild(document.createTextNode("Done"));
      _rumious_el11.appendChild(_rumious_el12);
      _rumious_el11.appendChild(document.createTextNode("\n            "));
      _rumious_el2.appendChild(_rumious_el11);
      _rumious_el2.appendChild(document.createTextNode("\n          "));
      _rumious_el.appendChild(_rumious_el2);
      _rumious_el.appendChild(document.createTextNode("\n        "));
      _rumious_frag.appendChild(_rumious_el);
      _rumious_frag.appendChild(document.createTextNode("\n      "));
      _rumious_root_324a6a64.appendChild(_rumious_frag);
      return _rumious_root_324a6a64;
    });
  }
}

class CanvasTextEditor extends s {
  static tagName = "aurora-canvas-text-editor";
  currentState = y("User edited");
  textAreaRef = g();
  constructor() {
    super();
  }
  onRender() {
    let context = this.props.context;
    context.on('canvas:read', () => {
      let time = new Date().toISOString();
      this.currentState.set(`Model readed - Last time: ${time}`);
      context.emit('canvas:content', this.textAreaRef.text);
    });
    context.on('canvas:write', commit => {
      let time = new Date().toISOString();
      this.currentState.set(`Model edited - Last time: ${time}`);
      this.textAreaRef.text = commit.content;
    });
  }
  onTextInputChange() {
    let time = new Date().toISOString();
    this.currentState.set(`User edited - Last time: ${time}`);
  }
  template() {
    return window.RUMIOUS_JSX.template(function (_rumious_root_b634073c, _rumious_ctx_2f352e71) {
      const _rumious_frag = document.createDocumentFragment();
      _rumious_frag.appendChild(document.createTextNode("\n        "));
      const _rumious_el = document.createElement("span");
      _rumious_el.setAttribute("class", "p-3");
      _rumious_el.appendChild(document.createTextNode("\n          "));
      const _rumious_el2 = document.createElement("h5");
      _rumious_el2.appendChild(document.createTextNode("Text editor "));
      _rumious_el.appendChild(_rumious_el2);
      _rumious_el.appendChild(document.createTextNode("\n          "));
      const _rumious_el3 = document.createElement("span");
      _rumious_el3.setAttribute("class", "sub-text");
      window.RUMIOUS_JSX.addDirective(_rumious_el3, _rumious_ctx_2f352e71, "bind", "text", this.currentState);
      _rumious_el.appendChild(_rumious_el3);
      _rumious_el.appendChild(document.createTextNode("\n        "));
      _rumious_frag.appendChild(_rumious_el);
      _rumious_frag.appendChild(document.createTextNode("\n        "));
      const _rumious_el4 = document.createElement("br");
      _rumious_frag.appendChild(_rumious_el4);
      const _rumious_el5 = document.createElement("br");
      _rumious_frag.appendChild(_rumious_el5);
      _rumious_frag.appendChild(document.createTextNode("\n        "));
      const _rumious_el6 = document.createElement("textarea");
      window.RUMIOUS_JSX.addDirective(_rumious_el6, _rumious_ctx_2f352e71, "ref", "standalone", this.textAreaRef);
      window.RUMIOUS_JSX.addDirective(_rumious_el6, _rumious_ctx_2f352e71, "on", "change", () => this.onTextInputChange());
      _rumious_el6.setAttribute("style", "width:100%; height:50vh;");
      _rumious_frag.appendChild(_rumious_el6);
      _rumious_frag.appendChild(document.createTextNode("\n      "));
      _rumious_root_b634073c.appendChild(_rumious_frag);
      return _rumious_root_b634073c;
    });
  }
}

class Canvas extends s {
  static tagName = "aurora-canvas";
  canvasRef = g();
  emptyPlaceholder = g();
  canvasContentRef = g();
  constructor() {
    super();
  }
  addObject(data) {
    this.emptyPlaceholder.addClasses("d-none");
    this.canvasContentRef.text = "";
    switch (data) {
      case "text":
        this.canvasContentRef.addChild(this.render(window.RUMIOUS_JSX.template(function (_rumious_root_4a164e0f, _rumious_ctx_34b97acd) {
          const _rumious_el = window.RUMIOUS_JSX.createComponent(CanvasTextEditor);
          _rumious_el.setup(_rumious_ctx_34b97acd, CanvasTextEditor);
          _rumious_el.props["context"] = this.props.context;
          _rumious_root_4a164e0f.appendChild(_rumious_el);
          return _rumious_root_4a164e0f;
        })));
        break;
    }
  }
  onRender() {
    let context = this.props.context;
    context.on("canvas:mode:change", data => this.addObject(data));
    context.on("canvas:open", () => this.element.classList.add("open"));
    context.on("canvas:close", () => this.element.classList.remove("open"));
  }
  onChangeBtnClick() {
    this.warp(window.RUMIOUS_JSX.template(function (_rumious_root_a39459ba, _rumious_ctx_2688c563) {
      const _rumious_el2 = window.RUMIOUS_JSX.createComponent(SelectCanvasModeModal);
      _rumious_el2.setup(_rumious_ctx_2688c563, SelectCanvasModeModal);
      _rumious_el2.props["context"] = this.props.context;
      _rumious_root_a39459ba.appendChild(_rumious_el2);
      return _rumious_root_a39459ba;
    }), document.body);
  }
  template() {
    return window.RUMIOUS_JSX.template(function (_rumious_root_e60aaec6, _rumious_ctx_e741f44f) {
      const _rumious_frag = document.createDocumentFragment();
      _rumious_frag.appendChild(document.createTextNode("\n        "));
      const _rumious_el3 = document.createElement("div");
      window.RUMIOUS_JSX.addDirective(_rumious_el3, _rumious_ctx_e741f44f, "ref", "standalone", this.canvasRef);
      _rumious_el3.setAttribute("class", "canvas-header p-3 d-flex align-center ");
      _rumious_el3.appendChild(document.createTextNode("\n          "));
      const _rumious_el4 = document.createElement("h4");
      _rumious_el4.appendChild(document.createTextNode("Canvas"));
      _rumious_el3.appendChild(_rumious_el4);
      _rumious_el3.appendChild(document.createTextNode("\n          "));
      const _rumious_el5 = document.createElement("div");
      _rumious_el5.setAttribute("class", "ml-auto d-flex align-center");
      _rumious_el5.appendChild(document.createTextNode("\n            "));
      const _rumious_el6 = document.createElement("button");
      window.RUMIOUS_JSX.addDirective(_rumious_el6, _rumious_ctx_e741f44f, "on", "click", () => this.onChangeBtnClick());
      _rumious_el6.setAttribute("class", "ml-auto btn btn-icon material-icons");
      _rumious_el6.appendChild(document.createTextNode("change_circle"));
      _rumious_el5.appendChild(_rumious_el6);
      _rumious_el5.appendChild(document.createTextNode("\n            "));
      const _rumious_el7 = document.createElement("button");
      window.RUMIOUS_JSX.addDirective(_rumious_el7, _rumious_ctx_e741f44f, "on", "click", () => this.element.classList.remove("open"));
      _rumious_el7.setAttribute("class", "ml-auto btn btn-icon material-icons");
      _rumious_el7.appendChild(document.createTextNode("close"));
      _rumious_el5.appendChild(_rumious_el7);
      _rumious_el5.appendChild(document.createTextNode("\n          "));
      _rumious_el3.appendChild(_rumious_el5);
      _rumious_el3.appendChild(document.createTextNode("\n        "));
      _rumious_frag.appendChild(_rumious_el3);
      _rumious_frag.appendChild(document.createTextNode("\n        "));
      const _rumious_el8 = document.createElement("div");
      _rumious_el8.setAttribute("class", "p-3 canvas-contents");
      _rumious_el8.appendChild(document.createTextNode("\n          "));
      const _rumious_el9 = document.createElement("span");
      window.RUMIOUS_JSX.addDirective(_rumious_el9, _rumious_ctx_e741f44f, "ref", "standalone", this.emptyPlaceholder);
      _rumious_el9.appendChild(document.createTextNode("\n            "));
      const _rumious_el10 = window.RUMIOUS_JSX.createComponent(EmptyPlaceholder);
      _rumious_el10.setup(_rumious_ctx_e741f44f, EmptyPlaceholder);
      _rumious_el10.props["content"] = "No item here";
      _rumious_el9.appendChild(_rumious_el10);
      _rumious_el9.appendChild(document.createTextNode("\n          "));
      _rumious_el8.appendChild(_rumious_el9);
      _rumious_el8.appendChild(document.createTextNode("\n          "));
      const _rumious_el11 = document.createElement("span");
      window.RUMIOUS_JSX.addDirective(_rumious_el11, _rumious_ctx_e741f44f, "ref", "standalone", this.canvasContentRef);
      _rumious_el8.appendChild(_rumious_el11);
      _rumious_el8.appendChild(document.createTextNode("\n        "));
      _rumious_frag.appendChild(_rumious_el8);
      _rumious_frag.appendChild(document.createTextNode("\n      "));
      _rumious_root_e60aaec6.appendChild(_rumious_frag);
      return _rumious_root_e60aaec6;
    });
  }
}

const isMobileView = (bp = 768) => window.innerWidth <= bp;
class ChatBox extends s {
  static tagName = "aurora-chatbox";
  headerRef = g();
  listMsg = g();
  messageRef = g();
  emptyPlaceholder = g();
  constructor() {
    super();
  }
  addNote(msg) {
    this.listMsg.addChild(this.render(window.RUMIOUS_JSX.template(function (_rumious_root_70c8aee3, _rumious_ctx_f6af92c2) {
      const _rumious_el = document.createElement("div");
      _rumious_el.setAttribute("class", "divider divider-text");
      _rumious_el.appendChild(document.createTextNode("\n        "));
      const _rumious_dymanic_ = document.createTextNode("");
      _rumious_el.appendChild(_rumious_dymanic_);
      window.RUMIOUS_JSX.dynamicValue(_rumious_el, _rumious_dymanic_, msg, _rumious_ctx_f6af92c2);
      _rumious_el.appendChild(document.createTextNode("\n      "));
      _rumious_root_70c8aee3.appendChild(_rumious_el);
      return _rumious_root_70c8aee3;
    })));
    this.emptyPlaceholder.addClasses("d-none");
    this.scrollToBottom();
  }
  addMessage(msg) {
    this.listMsg.addChild(this.render(window.RUMIOUS_JSX.template(function (_rumious_root_766c71e0, _rumious_ctx_4f60b79f) {
      const _rumious_el2 = document.createElement("div");
      _rumious_el2.setAttribute("class", "message");
      _rumious_el2.appendChild(document.createTextNode("\n        "));
      const _rumious_el3 = document.createElement("span");
      _rumious_el3.setAttribute("class", "message-info");
      _rumious_el3.appendChild(document.createTextNode("\n          "));
      const _rumious_el4 = document.createElement("img");
      _rumious_el4.setAttribute("class", "avatar avatar-smd");
      _rumious_el4.setAttribute("src", "./assets/bg.jpeg");
      _rumious_el4.setAttribute("style", "width:33px; height:33px;");
      _rumious_el3.appendChild(_rumious_el4);
      _rumious_el3.appendChild(document.createTextNode("\n          "));
      const _rumious_el5 = document.createElement("span");
      _rumious_el5.setAttribute("class", "message-sender");
      _rumious_el5.appendChild(document.createTextNode("\n            "));
      const _rumious_el6 = document.createElement("span");
      const _rumious_dymanic_2 = document.createTextNode("");
      _rumious_el6.appendChild(_rumious_dymanic_2);
      window.RUMIOUS_JSX.dynamicValue(_rumious_el6, _rumious_dymanic_2, msg.sender.name, _rumious_ctx_4f60b79f);
      _rumious_el5.appendChild(_rumious_el6);
      _rumious_el5.appendChild(document.createTextNode("\n            "));
      const _rumious_el7 = document.createElement("span");
      _rumious_el7.setAttribute("class", "sub-text");
      const _rumious_dymanic_3 = document.createTextNode("");
      _rumious_el7.appendChild(_rumious_dymanic_3);
      window.RUMIOUS_JSX.dynamicValue(_rumious_el7, _rumious_dymanic_3, msg.sender.role, _rumious_ctx_4f60b79f);
      _rumious_el5.appendChild(_rumious_el7);
      _rumious_el5.appendChild(document.createTextNode("\n          "));
      _rumious_el3.appendChild(_rumious_el5);
      _rumious_el3.appendChild(document.createTextNode("\n        "));
      _rumious_el2.appendChild(_rumious_el3);
      _rumious_el2.appendChild(document.createTextNode("\n        "));
      const _rumious_el8 = document.createElement("div");
      _rumious_el8.setAttribute("class", "message-content");
      _rumious_el8.appendChild(document.createTextNode("\n          "));
      const _rumious_dymanic_4 = document.createTextNode("");
      _rumious_el8.appendChild(_rumious_dymanic_4);
      window.RUMIOUS_JSX.dynamicValue(_rumious_el8, _rumious_dymanic_4, msg.contents.map(item => window.RUMIOUS_JSX.template(function (_rumious_root_6e282cae, _rumious_ctx_b6308f2e) {
        const _rumious_el9 = document.createElement("span");
        window.RUMIOUS_JSX.addDirective(_rumious_el9, _rumious_ctx_b6308f2e, "inject", "standalone", u(marked.parse(item)));
        _rumious_root_6e282cae.appendChild(_rumious_el9);
        return _rumious_root_6e282cae;
      })), _rumious_ctx_4f60b79f);
      _rumious_el8.appendChild(document.createTextNode("\n        "));
      _rumious_el2.appendChild(_rumious_el8);
      _rumious_el2.appendChild(document.createTextNode("\n      "));
      _rumious_root_766c71e0.appendChild(_rumious_el2);
      return _rumious_root_766c71e0;
    })));
    this.emptyPlaceholder.addClasses("d-none");
    this.scrollToBottom();
  }
  scrollToBottom() {
    requestAnimationFrame(() => {
      const el = isMobileView() ? window : this.listMsg.target;
      el.scrollTo({
        top: el === window ? document.documentElement.scrollHeight : el.scrollHeight,
        behavior: 'smooth'
      });
    });
  }
  onCreate() {
    this.props.context.on("msg", msg => this.addMessage(msg));
    this.props.context.on("error", () => this.addNote("An error occurred "));
  }
  async onRender() {
    if (isMobileView()) {
      window.addEventListener("scroll", () => {
        const method = window.scrollY > 100 ? 'addClasses' : 'removeClasses';
        this.headerRef[method]('sticky');
      });
    }
    const ctx = this.props.context;
    await ChatService.initChat(ctx, ctx.get("user"));
    for (let msg of ctx.get("messages")) {
      this.addMessage(msg);
    }
    ChatService.listenMsg(ctx);
  }
  onSendBtnClick() {
    const msg = this.messageRef.value?.trim();
    if (!msg) return;
    const ctx = this.props.context;
    ChatService.sendMsgText(ctx, ctx.get("user"), msg);
    this.messageRef.value = "";
  }
  template() {
    return window.RUMIOUS_JSX.template(function (_rumious_root_a25244f4, _rumious_ctx_3235764c) {
      const _rumious_frag = document.createDocumentFragment();
      _rumious_frag.appendChild(document.createTextNode("\n        "));
      const _rumious_el10 = document.createElement("div");
      window.RUMIOUS_JSX.addDirective(_rumious_el10, _rumious_ctx_3235764c, "ref", "standalone", this.headerRef);
      _rumious_el10.setAttribute("class", "chatbox-header p-3 d-flex align-center");
      _rumious_el10.appendChild(document.createTextNode("\n          "));
      const _rumious_el11 = document.createElement("h4");
      _rumious_el11.appendChild(document.createTextNode("Chat"));
      _rumious_el10.appendChild(_rumious_el11);
      _rumious_el10.appendChild(document.createTextNode("\n          "));
      const _rumious_el12 = document.createElement("span");
      _rumious_el12.setAttribute("class", "ml-auto  d-flex align-center");
      _rumious_el12.appendChild(document.createTextNode("\n            "));
      const _rumious_el13 = document.createElement("button");
      _rumious_el13.setAttribute("class", "ml-auto btn btn-icon material-icons");
      _rumious_el13.appendChild(document.createTextNode("add"));
      _rumious_el12.appendChild(_rumious_el13);
      _rumious_el12.appendChild(document.createTextNode("\n            "));
      const _rumious_el14 = document.createElement("button");
      _rumious_el14.setAttribute("class", "ml-auto open-canvas-btn btn btn-icon material-icons");
      window.RUMIOUS_JSX.addDirective(_rumious_el14, _rumious_ctx_3235764c, "on", "click", () => this.props.context.emit("canvas:open", null));
      _rumious_el14.appendChild(document.createTextNode("menu_open"));
      _rumious_el12.appendChild(_rumious_el14);
      _rumious_el12.appendChild(document.createTextNode("\n          "));
      _rumious_el10.appendChild(_rumious_el12);
      _rumious_el10.appendChild(document.createTextNode("\n        "));
      _rumious_frag.appendChild(_rumious_el10);
      _rumious_frag.appendChild(document.createTextNode("\n        \n        "));
      const _rumious_el15 = document.createElement("div");
      window.RUMIOUS_JSX.addDirective(_rumious_el15, _rumious_ctx_3235764c, "ref", "standalone", this.listMsg);
      _rumious_el15.setAttribute("class", "chatbox-contents p-3");
      _rumious_el15.appendChild(document.createTextNode("\n          "));
      const _rumious_el16 = document.createElement("span");
      window.RUMIOUS_JSX.addDirective(_rumious_el16, _rumious_ctx_3235764c, "ref", "standalone", this.emptyPlaceholder);
      _rumious_el16.appendChild(document.createTextNode("\n            "));
      const _rumious_el17 = window.RUMIOUS_JSX.createComponent(EmptyPlaceholder);
      _rumious_el17.setup(_rumious_ctx_3235764c, EmptyPlaceholder);
      _rumious_el17.props["content"] = "Everything is ready, let's start your conversation  ";
      _rumious_el17.props["icon"] = "forum";
      _rumious_el16.appendChild(_rumious_el17);
      _rumious_el16.appendChild(document.createTextNode("\n          "));
      _rumious_el15.appendChild(_rumious_el16);
      _rumious_el15.appendChild(document.createTextNode("\n        "));
      _rumious_frag.appendChild(_rumious_el15);
      _rumious_frag.appendChild(document.createTextNode("\n        "));
      const _rumious_el18 = document.createElement("div");
      _rumious_el18.setAttribute("class", "chatbox-input d-flex flex-column align-center justify-between");
      _rumious_el18.appendChild(document.createTextNode("\n          "));
      const _rumious_el19 = document.createElement("button");
      _rumious_el19.setAttribute("class", "btn btn-icon material-icons");
      _rumious_el19.appendChild(document.createTextNode("add"));
      _rumious_el18.appendChild(_rumious_el19);
      _rumious_el18.appendChild(document.createTextNode("\n          "));
      const _rumious_el20 = document.createElement("input");
      window.RUMIOUS_JSX.addDirective(_rumious_el20, _rumious_ctx_3235764c, "ref", "standalone", this.messageRef);
      _rumious_el20.setAttribute("type", "text");
      _rumious_el20.setAttribute("class", "form-input");
      _rumious_el20.setAttribute("placeholder", "Type message ...");
      _rumious_el18.appendChild(_rumious_el20);
      _rumious_el18.appendChild(document.createTextNode("\n          "));
      const _rumious_el21 = document.createElement("button");
      window.RUMIOUS_JSX.addDirective(_rumious_el21, _rumious_ctx_3235764c, "on", "click", () => this.onSendBtnClick());
      _rumious_el21.setAttribute("class", "btn btn-icon material-icons");
      _rumious_el21.appendChild(document.createTextNode("send"));
      _rumious_el18.appendChild(_rumious_el21);
      _rumious_el18.appendChild(document.createTextNode("\n        "));
      _rumious_frag.appendChild(_rumious_el18);
      _rumious_frag.appendChild(document.createTextNode("\n      "));
      _rumious_root_a25244f4.appendChild(_rumious_frag);
      return _rumious_root_a25244f4;
    });
  }
}

class Page extends s {
  embedElement = g();
  chatContext = _({
    title: "Chat #1",
    messages: [],
    canvas: {
      mode: "text"
    },
    user: {
      name: "User #1",
      id: Date.now().toString(32),
      role: "User"
    }
  });
  constructor() {
    super();
  }
  template() {
    return window.RUMIOUS_JSX.template(function (_rumious_root_55b1ee5f, _rumious_ctx_1839db3a) {
      const _rumious_frag = document.createDocumentFragment();
      _rumious_frag.appendChild(document.createTextNode("\n        "));
      const _rumious_el = document.createElement("div");
      _rumious_el.setAttribute("class", "panel");
      _rumious_el.setAttribute("style", "margin-top: 1rem;");
      _rumious_el.appendChild(document.createTextNode("\n          "));
      const _rumious_el2 = document.createElement("div");
      _rumious_el2.setAttribute("class", "content");
      _rumious_el2.appendChild(document.createTextNode("\n            "));
      const _rumious_el3 = window.RUMIOUS_JSX.createComponent(ChatBox);
      _rumious_el3.setup(_rumious_ctx_1839db3a, ChatBox);
      _rumious_el3.props["context"] = this.chatContext;
      _rumious_el2.appendChild(_rumious_el3);
      _rumious_el2.appendChild(document.createTextNode("\n          "));
      _rumious_el.appendChild(_rumious_el2);
      _rumious_el.appendChild(document.createTextNode("\n          "));
      const _rumious_el4 = document.createElement("div");
      window.RUMIOUS_JSX.addDirective(_rumious_el4, _rumious_ctx_1839db3a, "ref", "standalone", this.embedElement);
      _rumious_el4.setAttribute("class", "content");
      _rumious_el4.appendChild(document.createTextNode("\n            "));
      const _rumious_el5 = window.RUMIOUS_JSX.createComponent(Canvas);
      _rumious_el5.setup(_rumious_ctx_1839db3a, Canvas);
      _rumious_el5.props["context"] = this.chatContext;
      _rumious_el4.appendChild(_rumious_el5);
      _rumious_el4.appendChild(document.createTextNode("\n          "));
      _rumious_el.appendChild(_rumious_el4);
      _rumious_el.appendChild(document.createTextNode("\n        "));
      _rumious_frag.appendChild(_rumious_el);
      _rumious_frag.appendChild(document.createTextNode("\n      "));
      _rumious_root_55b1ee5f.appendChild(_rumious_frag);
      return _rumious_root_55b1ee5f;
    });
  }
}

export { Page };
//# sourceMappingURL=home.js.map
