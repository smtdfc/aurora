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
    return window.RUMIOUS_JSX.template(function (_rumious_root_8acbd1a3, _rumious_ctx_592d8752) {
      const _rumious_el = document.createElement("div");
      _rumious_el.setAttribute("class", "empty-state d-flex flex-col align-center justify-center p-4 text-muted");
      _rumious_el.appendChild(document.createTextNode("\n        "));
      const _rumious_el2 = document.createElement("i");
      _rumious_el2.setAttribute("class", "material-icons mb-2");
      _rumious_el2.setAttribute("style", "font-size: 48px;");
      const _rumious_dymanic_ = document.createTextNode("");
      _rumious_el2.appendChild(_rumious_dymanic_);
      window.RUMIOUS_JSX.dynamicValue(_rumious_el2, _rumious_dymanic_, this.props.icon ?? "inbox", _rumious_ctx_592d8752);
      _rumious_el.appendChild(_rumious_el2);
      _rumious_el.appendChild(document.createTextNode("\n        "));
      const _rumious_el3 = document.createElement("p");
      const _rumious_dymanic_2 = document.createTextNode("");
      _rumious_el3.appendChild(_rumious_dymanic_2);
      window.RUMIOUS_JSX.dynamicValue(_rumious_el3, _rumious_dymanic_2, this.props.content ?? "No content here", _rumious_ctx_592d8752);
      _rumious_el.appendChild(_rumious_el3);
      _rumious_el.appendChild(document.createTextNode("\n      "));
      _rumious_root_8acbd1a3.appendChild(_rumious_el);
      return _rumious_root_8acbd1a3;
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
  static async sendMsgText(context, sender, text, image = null) {
    const chatData = {
      id: Date.now().toString(32),
      sender,
      contents: typeof text === 'string' ? [text] : text,
      image
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
    return window.RUMIOUS_JSX.template(function (_rumious_root_58f02516, _rumious_ctx_4a7d5297) {
      const _rumious_frag = document.createDocumentFragment();
      _rumious_frag.appendChild(document.createTextNode("\n        "));
      const _rumious_el = document.createElement("div");
      _rumious_el.setAttribute("class", "modal");
      window.RUMIOUS_JSX.addDirective(_rumious_el, _rumious_ctx_4a7d5297, "ref", "standalone", this.modalRef);
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
      window.RUMIOUS_JSX.addDirective(_rumious_el5, _rumious_ctx_4a7d5297, "on", "click", () => this.closeModal());
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
      window.RUMIOUS_JSX.addDirective(_rumious_el9, _rumious_ctx_4a7d5297, "model", "standalone", this.currentType);
      _rumious_el9.appendChild(document.createTextNode("\n                  "));
      const _rumious_dymanic_ = document.createTextNode("");
      _rumious_el9.appendChild(_rumious_dymanic_);
      window.RUMIOUS_JSX.dynamicValue(_rumious_el9, _rumious_dymanic_, Object.entries(CANVAS_MODES).map(([key, label]) => window.RUMIOUS_JSX.template(function (_rumious_root_ec3dcbfd, _rumious_ctx_89beea5f) {
        const _rumious_el13 = document.createElement("option");
        _rumious_el13.setAttribute("value", key);
        const _rumious_dymanic_2 = document.createTextNode("");
        _rumious_el13.appendChild(_rumious_dymanic_2);
        window.RUMIOUS_JSX.dynamicValue(_rumious_el13, _rumious_dymanic_2, label, _rumious_ctx_89beea5f);
        _rumious_root_ec3dcbfd.appendChild(_rumious_el13);
        return _rumious_root_ec3dcbfd;
      })), _rumious_ctx_4a7d5297);
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
      window.RUMIOUS_JSX.addDirective(_rumious_el12, _rumious_ctx_4a7d5297, "on", "click", () => this.onDoneBtnClick());
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
      _rumious_root_58f02516.appendChild(_rumious_frag);
      return _rumious_root_58f02516;
    });
  }
}

class CanvasTextEditor extends s {
  static tagName = "aurora-canvas-text-editor";
  currentState = y("User edited");
  textAreaRef = g();
  easyMDEInstance = null;
  constructor() {
    super();
  }
  injectCDNAssets() {
    return new Promise(resolve => {
      if (!document.querySelector('#easymde-css')) {
        const link = document.createElement('link');
        link.id = 'easymde-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/easymde/dist/easymde.min.css';
        document.head.appendChild(link);
      }
      if (!document.querySelector('#easymde-js')) {
        const script = document.createElement('script');
        script.id = 'easymde-js';
        script.src = 'https://unpkg.com/easymde/dist/easymde.min.js';
        script.onload = () => resolve();
        document.head.appendChild(script);
      } else {
        resolve();
      }
    });
  }
  async initEditor() {
    await this.injectCDNAssets();
    this.easyMDEInstance = new window.EasyMDE({
      element: this.textAreaRef.value,
      spellChecker: false,
      toolbar: ["bold", "italic", "heading", "|", "quote", "code", "link", "preview"],
      minHeight: "300px",
      autoDownloadFontAwesome: false
    });
  }
  onRender() {
    const context = this.props.context;
    context.on('canvas:read', async () => {
      await this.initEditor();
      const time = new Date().toISOString();
      this.currentState.set(`Model readed - Last time: ${time}`);
      const content = this.easyMDEInstance?.value?.() || this.textAreaRef.value?.value || '';
      context.emit('canvas:content', content);
    });
    context.on('canvas:write', async commit => {
      await this.initEditor();
      const time = new Date().toISOString();
      this.currentState.set(`Model edited - Last time: ${time}`);
      if (this.easyMDEInstance) {
        this.easyMDEInstance.value(commit.content);
      } else {
        this.textAreaRef.text = commit.content;
      }
    });
  }
  onTextInputChange() {
    const time = new Date().toISOString();
    this.currentState.set(`User edited - Last time: ${time}`);
  }
  template() {
    return window.RUMIOUS_JSX.template(function (_rumious_root_1cc660fc, _rumious_ctx_6eae65b8) {
      const _rumious_frag = document.createDocumentFragment();
      _rumious_frag.appendChild(document.createTextNode("\n        "));
      const _rumious_el = document.createElement("span");
      _rumious_el.setAttribute("class", "p-3");
      _rumious_el.appendChild(document.createTextNode("\n          "));
      const _rumious_el2 = document.createElement("h5");
      _rumious_el2.appendChild(document.createTextNode("Text editor"));
      _rumious_el.appendChild(_rumious_el2);
      _rumious_el.appendChild(document.createTextNode("\n          "));
      const _rumious_el3 = document.createElement("span");
      _rumious_el3.setAttribute("class", "sub-text");
      window.RUMIOUS_JSX.addDirective(_rumious_el3, _rumious_ctx_6eae65b8, "bind", "text", this.currentState);
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
      window.RUMIOUS_JSX.addDirective(_rumious_el6, _rumious_ctx_6eae65b8, "ref", "standalone", this.textAreaRef);
      window.RUMIOUS_JSX.addDirective(_rumious_el6, _rumious_ctx_6eae65b8, "on", "change", () => this.onTextInputChange());
      _rumious_el6.setAttribute("style", "width:100%; height:50vh;");
      _rumious_frag.appendChild(_rumious_el6);
      _rumious_frag.appendChild(document.createTextNode("\n      "));
      _rumious_root_1cc660fc.appendChild(_rumious_frag);
      return _rumious_root_1cc660fc;
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
        this.canvasContentRef.addChild(this.render(window.RUMIOUS_JSX.template(function (_rumious_root_de7a1777, _rumious_ctx_e236a49b) {
          const _rumious_el = window.RUMIOUS_JSX.createComponent(CanvasTextEditor);
          _rumious_el.setup(_rumious_ctx_e236a49b, CanvasTextEditor);
          _rumious_el.props["context"] = this.props.context;
          _rumious_root_de7a1777.appendChild(_rumious_el);
          return _rumious_root_de7a1777;
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
    this.warp(window.RUMIOUS_JSX.template(function (_rumious_root_7f180286, _rumious_ctx_527dab9e) {
      const _rumious_el2 = window.RUMIOUS_JSX.createComponent(SelectCanvasModeModal);
      _rumious_el2.setup(_rumious_ctx_527dab9e, SelectCanvasModeModal);
      _rumious_el2.props["context"] = this.props.context;
      _rumious_root_7f180286.appendChild(_rumious_el2);
      return _rumious_root_7f180286;
    }), document.body);
  }
  template() {
    return window.RUMIOUS_JSX.template(function (_rumious_root_bd9f8921, _rumious_ctx_24fc8996) {
      const _rumious_frag = document.createDocumentFragment();
      _rumious_frag.appendChild(document.createTextNode("\n        "));
      const _rumious_el3 = document.createElement("div");
      window.RUMIOUS_JSX.addDirective(_rumious_el3, _rumious_ctx_24fc8996, "ref", "standalone", this.canvasRef);
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
      window.RUMIOUS_JSX.addDirective(_rumious_el6, _rumious_ctx_24fc8996, "on", "click", () => this.onChangeBtnClick());
      _rumious_el6.setAttribute("class", "ml-auto btn btn-icon material-icons");
      _rumious_el6.appendChild(document.createTextNode("change_circle"));
      _rumious_el5.appendChild(_rumious_el6);
      _rumious_el5.appendChild(document.createTextNode("\n            "));
      const _rumious_el7 = document.createElement("button");
      window.RUMIOUS_JSX.addDirective(_rumious_el7, _rumious_ctx_24fc8996, "on", "click", () => this.element.classList.remove("open"));
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
      window.RUMIOUS_JSX.addDirective(_rumious_el9, _rumious_ctx_24fc8996, "ref", "standalone", this.emptyPlaceholder);
      _rumious_el9.appendChild(document.createTextNode("\n            "));
      const _rumious_el10 = window.RUMIOUS_JSX.createComponent(EmptyPlaceholder);
      _rumious_el10.setup(_rumious_ctx_24fc8996, EmptyPlaceholder);
      _rumious_el10.props["content"] = "No item here";
      _rumious_el9.appendChild(_rumious_el10);
      _rumious_el9.appendChild(document.createTextNode("\n          "));
      _rumious_el8.appendChild(_rumious_el9);
      _rumious_el8.appendChild(document.createTextNode("\n          "));
      const _rumious_el11 = document.createElement("span");
      window.RUMIOUS_JSX.addDirective(_rumious_el11, _rumious_ctx_24fc8996, "ref", "standalone", this.canvasContentRef);
      _rumious_el8.appendChild(_rumious_el11);
      _rumious_el8.appendChild(document.createTextNode("\n        "));
      _rumious_frag.appendChild(_rumious_el8);
      _rumious_frag.appendChild(document.createTextNode("\n      "));
      _rumious_root_bd9f8921.appendChild(_rumious_frag);
      return _rumious_root_bd9f8921;
    });
  }
}

class TakePhotoModal extends s {
  static tagName = "aurora-take-photo-modal";
  modalRef = g();
  videoRef = g();
  canvasRef = g();
  stream = null;
  getModal() {
    return new l(this.modalRef.target);
  }
  closeModal() {
    this.getModal().close();
    this.stopCamera();
    setTimeout(() => this.element.remove(), 5000);
  }
  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });
      const video = this.videoRef.target;
      video.srcObject = this.stream;
      video.play();
    } catch (error) {
      console.error("Failed to access webcam:", error);
    }
  }
  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
  capturePhoto() {
    const context = this.props.context;
    const video = this.videoRef.target;
    const canvas = this.canvasRef.target;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/png");
    context.emit('chat:input:attach:image', imageData);
    this.closeModal();
  }
  onRender() {
    this.getModal().open();
    this.startCamera();
  }
  template() {
    return window.RUMIOUS_JSX.template(function (_rumious_root_ccea4b52, _rumious_ctx_ae69d7d6) {
      const _rumious_frag = document.createDocumentFragment();
      _rumious_frag.appendChild(document.createTextNode("\n        "));
      const _rumious_el = document.createElement("div");
      _rumious_el.setAttribute("class", "modal");
      window.RUMIOUS_JSX.addDirective(_rumious_el, _rumious_ctx_ae69d7d6, "ref", "standalone", this.modalRef);
      _rumious_el.appendChild(document.createTextNode("\n          "));
      const _rumious_el2 = document.createElement("div");
      _rumious_el2.setAttribute("class", "modal-content");
      _rumious_el2.appendChild(document.createTextNode("\n            "));
      const _rumious_el3 = document.createElement("div");
      _rumious_el3.setAttribute("class", "modal-header");
      _rumious_el3.appendChild(document.createTextNode("\n              "));
      const _rumious_el4 = document.createElement("h3");
      _rumious_el4.setAttribute("class", "modal-title");
      _rumious_el4.appendChild(document.createTextNode("Take photo"));
      _rumious_el3.appendChild(_rumious_el4);
      _rumious_el3.appendChild(document.createTextNode("\n              "));
      const _rumious_el5 = document.createElement("button");
      window.RUMIOUS_JSX.addDirective(_rumious_el5, _rumious_ctx_ae69d7d6, "on", "click", () => this.closeModal());
      _rumious_el5.setAttribute("class", "ml-auto btn btn-icon material-icons");
      _rumious_el5.appendChild(document.createTextNode("close"));
      _rumious_el3.appendChild(_rumious_el5);
      _rumious_el3.appendChild(document.createTextNode("\n            "));
      _rumious_el2.appendChild(_rumious_el3);
      _rumious_el2.appendChild(document.createTextNode("\n            "));
      const _rumious_el6 = document.createElement("div");
      _rumious_el6.setAttribute("class", "modal-body");
      _rumious_el6.appendChild(document.createTextNode("\n              "));
      const _rumious_el7 = document.createElement("video");
      window.RUMIOUS_JSX.addDirective(_rumious_el7, _rumious_ctx_ae69d7d6, "ref", "standalone", this.videoRef);
      _rumious_el7.setAttribute("class", "rounded shadow mb-4");
      _rumious_el7.setAttribute("autoplay", true);
      _rumious_el7.setAttribute("muted", true);
      _rumious_el7.setAttribute("style", "width:100%;");
      _rumious_el6.appendChild(_rumious_el7);
      _rumious_el6.appendChild(document.createTextNode("\n              "));
      const _rumious_el8 = document.createElement("canvas");
      window.RUMIOUS_JSX.addDirective(_rumious_el8, _rumious_ctx_ae69d7d6, "ref", "standalone", this.canvasRef);
      _rumious_el8.setAttribute("class", "hidden");
      _rumious_el8.setAttribute("style", "display: none;");
      _rumious_el6.appendChild(_rumious_el8);
      _rumious_el6.appendChild(document.createTextNode("\n            "));
      _rumious_el2.appendChild(_rumious_el6);
      _rumious_el2.appendChild(document.createTextNode("\n            "));
      const _rumious_el9 = document.createElement("div");
      _rumious_el9.setAttribute("class", "modal-footer p-5");
      _rumious_el9.appendChild(document.createTextNode("\n              "));
      const _rumious_el10 = document.createElement("button");
      window.RUMIOUS_JSX.addDirective(_rumious_el10, _rumious_ctx_ae69d7d6, "on", "click", () => this.capturePhoto());
      _rumious_el10.setAttribute("class", "btn btn-primary");
      _rumious_el10.appendChild(document.createTextNode("Capture"));
      _rumious_el9.appendChild(_rumious_el10);
      _rumious_el9.appendChild(document.createTextNode("\n            "));
      _rumious_el2.appendChild(_rumious_el9);
      _rumious_el2.appendChild(document.createTextNode("\n          "));
      _rumious_el.appendChild(_rumious_el2);
      _rumious_el.appendChild(document.createTextNode("\n        "));
      _rumious_frag.appendChild(_rumious_el);
      _rumious_frag.appendChild(document.createTextNode("\n      "));
      _rumious_root_ccea4b52.appendChild(_rumious_frag);
      return _rumious_root_ccea4b52;
    });
  }
}

const isMobileView = (bp = 768) => window.innerWidth <= bp;
class ChatBox extends s {
  static tagName = "aurora-chatbox";
  headerRef = g();
  listMsg = g();
  attachedContentRef = g();
  messageRef = g();
  emptyPlaceholder = g();
  attachedContents = [];
  constructor() {
    super();
  }
  addNote(msg) {
    this.listMsg.addChild(this.render(window.RUMIOUS_JSX.template(function (_rumious_root_d9fa7481, _rumious_ctx_1ebd01c7) {
      const _rumious_el = document.createElement("div");
      _rumious_el.setAttribute("class", "divider divider-text");
      _rumious_el.appendChild(document.createTextNode("\n        "));
      const _rumious_dymanic_ = document.createTextNode("");
      _rumious_el.appendChild(_rumious_dymanic_);
      window.RUMIOUS_JSX.dynamicValue(_rumious_el, _rumious_dymanic_, msg, _rumious_ctx_1ebd01c7);
      _rumious_el.appendChild(document.createTextNode("\n      "));
      _rumious_root_d9fa7481.appendChild(_rumious_el);
      return _rumious_root_d9fa7481;
    })));
    this.emptyPlaceholder.addClasses("d-none");
    this.scrollToBottom();
  }
  addMessage(msg) {
    this.listMsg.addChild(this.render(window.RUMIOUS_JSX.template(function (_rumious_root_93baf4a9, _rumious_ctx_03587f1c) {
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
      window.RUMIOUS_JSX.dynamicValue(_rumious_el6, _rumious_dymanic_2, msg.sender.name, _rumious_ctx_03587f1c);
      _rumious_el5.appendChild(_rumious_el6);
      _rumious_el5.appendChild(document.createTextNode("\n            "));
      const _rumious_el7 = document.createElement("span");
      _rumious_el7.setAttribute("class", "sub-text");
      const _rumious_dymanic_3 = document.createTextNode("");
      _rumious_el7.appendChild(_rumious_dymanic_3);
      window.RUMIOUS_JSX.dynamicValue(_rumious_el7, _rumious_dymanic_3, msg.sender.role, _rumious_ctx_03587f1c);
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
      window.RUMIOUS_JSX.dynamicValue(_rumious_el8, _rumious_dymanic_4, msg.contents.map(item => window.RUMIOUS_JSX.template(function (_rumious_root_526b9385, _rumious_ctx_b3c06fc5) {
        const _rumious_el9 = document.createElement("span");
        window.RUMIOUS_JSX.addDirective(_rumious_el9, _rumious_ctx_b3c06fc5, "inject", "standalone", u(marked.parse(item)));
        _rumious_root_526b9385.appendChild(_rumious_el9);
        return _rumious_root_526b9385;
      })), _rumious_ctx_03587f1c);
      _rumious_el8.appendChild(document.createTextNode("\n        "));
      _rumious_el2.appendChild(_rumious_el8);
      _rumious_el2.appendChild(document.createTextNode("\n      "));
      _rumious_root_93baf4a9.appendChild(_rumious_el2);
      return _rumious_root_93baf4a9;
    })));
    this.emptyPlaceholder.addClasses("d-none");
    this.scrollToBottom();
  }
  takePhoto() {
    this.warp(window.RUMIOUS_JSX.template(function (_rumious_root_b10bd4a1, _rumious_ctx_1d9bf83e) {
      const _rumious_el10 = window.RUMIOUS_JSX.createComponent(TakePhotoModal);
      _rumious_el10.setup(_rumious_ctx_1d9bf83e, TakePhotoModal);
      _rumious_el10.props["context"] = this.props.context;
      _rumious_root_b10bd4a1.appendChild(_rumious_el10);
      return _rumious_root_b10bd4a1;
    }), document.body);
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
  attachedImage(data) {
    this.attachedContents.push(data);
    this.attachedContentRef.addChild(this.render(window.RUMIOUS_JSX.template(function (_rumious_root_55de2bf2, _rumious_ctx_e461df58) {
      const _rumious_el11 = document.createElement("img");
      _rumious_el11.setAttribute("src", data);
      _rumious_root_55de2bf2.appendChild(_rumious_el11);
      return _rumious_root_55de2bf2;
    })));
  }
  onCreate() {
    this.props.context.on("msg", msg => this.addMessage(msg));
    this.props.context.on("error", () => this.addNote("An error occurred "));
    this.props.context.on("chat:input:attach:image", data => this.attachedImage(data));
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
    ChatService.sendMsgText(ctx, ctx.get("user"), msg, this.attachedContents[0]);
    this.messageRef.value = "";
    this.attachedContentRef.text = "";
  }
  template() {
    return window.RUMIOUS_JSX.template(function (_rumious_root_218dbd20, _rumious_ctx_7ae56f7e) {
      const _rumious_frag = document.createDocumentFragment();
      _rumious_frag.appendChild(document.createTextNode("\n        "));
      const _rumious_el12 = document.createElement("div");
      window.RUMIOUS_JSX.addDirective(_rumious_el12, _rumious_ctx_7ae56f7e, "ref", "standalone", this.headerRef);
      _rumious_el12.setAttribute("class", "chatbox-header p-3 d-flex align-center");
      _rumious_el12.appendChild(document.createTextNode("\n          "));
      const _rumious_el13 = document.createElement("h4");
      _rumious_el13.appendChild(document.createTextNode("Chat"));
      _rumious_el12.appendChild(_rumious_el13);
      _rumious_el12.appendChild(document.createTextNode("\n          "));
      const _rumious_el14 = document.createElement("span");
      _rumious_el14.setAttribute("class", "ml-auto  d-flex align-center");
      _rumious_el14.appendChild(document.createTextNode("\n            "));
      const _rumious_el15 = document.createElement("button");
      window.RUMIOUS_JSX.addDirective(_rumious_el15, _rumious_ctx_7ae56f7e, "on", "click", () => this.takePhoto());
      _rumious_el15.setAttribute("class", "ml-auto btn btn-icon material-icons");
      _rumious_el15.appendChild(document.createTextNode("add_a_photo"));
      _rumious_el14.appendChild(_rumious_el15);
      _rumious_el14.appendChild(document.createTextNode("\n            "));
      const _rumious_el16 = document.createElement("button");
      _rumious_el16.setAttribute("class", "ml-auto btn btn-icon material-icons");
      _rumious_el16.appendChild(document.createTextNode("add"));
      _rumious_el14.appendChild(_rumious_el16);
      _rumious_el14.appendChild(document.createTextNode("\n            "));
      const _rumious_el17 = document.createElement("button");
      _rumious_el17.setAttribute("class", "ml-auto open-canvas-btn btn btn-icon material-icons");
      window.RUMIOUS_JSX.addDirective(_rumious_el17, _rumious_ctx_7ae56f7e, "on", "click", () => this.props.context.emit("canvas:open", null));
      _rumious_el17.appendChild(document.createTextNode("menu_open"));
      _rumious_el14.appendChild(_rumious_el17);
      _rumious_el14.appendChild(document.createTextNode("\n          "));
      _rumious_el12.appendChild(_rumious_el14);
      _rumious_el12.appendChild(document.createTextNode("\n        "));
      _rumious_frag.appendChild(_rumious_el12);
      _rumious_frag.appendChild(document.createTextNode("\n        \n        "));
      const _rumious_el18 = document.createElement("div");
      window.RUMIOUS_JSX.addDirective(_rumious_el18, _rumious_ctx_7ae56f7e, "ref", "standalone", this.listMsg);
      _rumious_el18.setAttribute("class", "chatbox-contents p-3");
      _rumious_el18.appendChild(document.createTextNode("\n          "));
      const _rumious_el19 = document.createElement("span");
      window.RUMIOUS_JSX.addDirective(_rumious_el19, _rumious_ctx_7ae56f7e, "ref", "standalone", this.emptyPlaceholder);
      _rumious_el19.appendChild(document.createTextNode("\n            "));
      const _rumious_el20 = window.RUMIOUS_JSX.createComponent(EmptyPlaceholder);
      _rumious_el20.setup(_rumious_ctx_7ae56f7e, EmptyPlaceholder);
      _rumious_el20.props["content"] = "Everything is ready, let's start your conversation  ";
      _rumious_el20.props["icon"] = "forum";
      _rumious_el19.appendChild(_rumious_el20);
      _rumious_el19.appendChild(document.createTextNode("\n          "));
      _rumious_el18.appendChild(_rumious_el19);
      _rumious_el18.appendChild(document.createTextNode("\n        "));
      _rumious_frag.appendChild(_rumious_el18);
      _rumious_frag.appendChild(document.createTextNode("\n        "));
      const _rumious_el21 = document.createElement("div");
      _rumious_el21.setAttribute("class", "chatbox-input p-2");
      _rumious_el21.appendChild(document.createTextNode("\n          "));
      const _rumious_el22 = document.createElement("div");
      _rumious_el22.setAttribute("class", "attached-preview");
      window.RUMIOUS_JSX.addDirective(_rumious_el22, _rumious_ctx_7ae56f7e, "ref", "standalone", this.attachedContentRef);
      _rumious_el22.setAttribute("class", "attached-preview mb-2");
      _rumious_el21.appendChild(_rumious_el22);
      _rumious_el21.appendChild(document.createTextNode("\n          "));
      const _rumious_el23 = document.createElement("div");
      _rumious_el23.setAttribute("class", "input-bar d-flex align-center gap-2");
      _rumious_el23.appendChild(document.createTextNode("\n            "));
      const _rumious_el24 = document.createElement("button");
      window.RUMIOUS_JSX.addDirective(_rumious_el24, _rumious_ctx_7ae56f7e, "on", "click", () => this.takePhoto());
      _rumious_el24.setAttribute("class", "btn btn-icon material-icons");
      _rumious_el24.appendChild(document.createTextNode("add"));
      _rumious_el23.appendChild(_rumious_el24);
      _rumious_el23.appendChild(document.createTextNode("\n            "));
      const _rumious_el25 = document.createElement("input");
      window.RUMIOUS_JSX.addDirective(_rumious_el25, _rumious_ctx_7ae56f7e, "ref", "standalone", this.messageRef);
      _rumious_el25.setAttribute("type", "text");
      _rumious_el25.setAttribute("class", "form-input flex-1");
      _rumious_el25.setAttribute("placeholder", "Type message ...");
      _rumious_el23.appendChild(_rumious_el25);
      _rumious_el23.appendChild(document.createTextNode("\n            "));
      const _rumious_el26 = document.createElement("button");
      window.RUMIOUS_JSX.addDirective(_rumious_el26, _rumious_ctx_7ae56f7e, "on", "click", () => this.onSendBtnClick());
      _rumious_el26.setAttribute("class", "btn btn-icon material-icons");
      _rumious_el26.appendChild(document.createTextNode("send"));
      _rumious_el23.appendChild(_rumious_el26);
      _rumious_el23.appendChild(document.createTextNode("\n          "));
      _rumious_el21.appendChild(_rumious_el23);
      _rumious_el21.appendChild(document.createTextNode("\n        "));
      _rumious_frag.appendChild(_rumious_el21);
      _rumious_frag.appendChild(document.createTextNode("\n    "));
      _rumious_root_218dbd20.appendChild(_rumious_frag);
      return _rumious_root_218dbd20;
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
    return window.RUMIOUS_JSX.template(function (_rumious_root_147146c7, _rumious_ctx_71b6ed69) {
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
      _rumious_el3.setup(_rumious_ctx_71b6ed69, ChatBox);
      _rumious_el3.props["context"] = this.chatContext;
      _rumious_el2.appendChild(_rumious_el3);
      _rumious_el2.appendChild(document.createTextNode("\n          "));
      _rumious_el.appendChild(_rumious_el2);
      _rumious_el.appendChild(document.createTextNode("\n          "));
      const _rumious_el4 = document.createElement("div");
      window.RUMIOUS_JSX.addDirective(_rumious_el4, _rumious_ctx_71b6ed69, "ref", "standalone", this.embedElement);
      _rumious_el4.setAttribute("class", "content");
      _rumious_el4.appendChild(document.createTextNode("\n            "));
      const _rumious_el5 = window.RUMIOUS_JSX.createComponent(Canvas);
      _rumious_el5.setup(_rumious_ctx_71b6ed69, Canvas);
      _rumious_el5.props["context"] = this.chatContext;
      _rumious_el4.appendChild(_rumious_el5);
      _rumious_el4.appendChild(document.createTextNode("\n          "));
      _rumious_el.appendChild(_rumious_el4);
      _rumious_el.appendChild(document.createTextNode("\n        "));
      _rumious_frag.appendChild(_rumious_el);
      _rumious_frag.appendChild(document.createTextNode("\n      "));
      _rumious_root_147146c7.appendChild(_rumious_frag);
      return _rumious_root_147146c7;
    });
  }
}

export { Page };
//# sourceMappingURL=home.js.map
