import {
  RumiousComponent,
  Fragment,
  createElementRef,
  createHTMLInjector,
  RumiousContext
} from 'rumious';
import { EmptyPlaceholder } from './EmptyPlaceholder.jsx'
import { MessageInfo, ChatData } from '../types/index.js';
import { ChatService } from '../services/chat.js';

const isMobileView = (bp = 768) => window.innerWidth <= bp;

interface ChatBoxProps {
  context: RumiousContext < ChatData > ;
}

export class ChatBox extends RumiousComponent < ChatBoxProps > {
  static tagName = "smtdfc-chatbox";
  
  private headerRef = createElementRef();
  private listMsg = createElementRef();
  private messageRef = createElementRef();
  private emptyPlaceholder = createElementRef();
  constructor() {
    super();
  }
  
  addNote(
    msg: string
  ) {
    this.listMsg.addChild(this.render(
      <div class="divider divider-text">
        {msg}
      </div>
    ));
    this.emptyPlaceholder.addClasses("d-none");
    this.scrollToBottom();
  }
  
  addMessage(
    msg: MessageInfo
  ) {
    this.listMsg.addChild(this.render(
      <div class="message">
        <span class="message-info">
          <img class="avatar avatar-smd" src="./assets/bg.jpeg" style="width:33px; height:33px;" />
          <span class="message-sender">
            <span>{msg.sender.name}</span>
            <span class="sub-text">{msg.sender.role}</span>
          </span>
        </span>
        <div class="message-content">
          {msg.contents.map((item) => <span inject={createHTMLInjector(marked.parse(item))}></span>)}
        </div>
      </div>
    ));
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
    this.props.context.on("msg", (msg: MessageInfo) => this.addMessage(msg));
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
    await ChatService.initChat(ctx, ctx.get("user") !);
    for (let msg of ctx.get("messages") !) {
      this.addMessage(msg);
    }
    
    ChatService.listenMsg(ctx);
  }
  
  
  onSendBtnClick() {
    const msg = this.messageRef.value?.trim();
    if (!msg) return;
    
    const ctx = this.props.context;
    ChatService.sendMsgText(ctx, ctx.get("user") !, msg);
    this.messageRef.value = "";
  }
  
  template() {
    return (
      <Fragment>
        <div ref={this.headerRef} class="chatbox-header p-3 d-flex align-center">
          <h4>Chat</h4>
          <button class="ml-auto btn btn-icon material-icons">add</button>
        </div>
        
        <div ref={this.listMsg} class="chatbox-contents p-3">
          <span ref={this.emptyPlaceholder}>
            <EmptyPlaceholder 
              content="Everything is ready, let's start your conversation  " 
              icon="forum"
            />
          </span>
        </div>
        <div class="chatbox-input d-flex flex-column align-center justify-between">
          <button class="btn btn-icon material-icons">add</button>
          <input ref={this.messageRef} type="text" class="form-input" placeholder="Type message ..." />
          <button on:click={() => this.onSendBtnClick()} class="btn btn-icon material-icons">send</button>
        </div>
      </Fragment>
    );
  }
}