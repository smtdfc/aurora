import {
  RumiousComponent,
  Fragment,
  createElementRef,
  createHTMLInjector,
  RumiousContext
} from 'rumious';
import { EmptyPlaceholder } from './EmptyPlaceholder.jsx'
import { TakePhotoModal } from './TakePhotoModal.jsx'

import { MessageInfo, ChatData } from '../types/index.js';
import { ChatService } from '../services/chat.js';

const isMobileView = (bp = 768) => window.innerWidth <= bp;

interface ChatBoxProps {
  context: RumiousContext < ChatData > ;
}

export class ChatBox extends RumiousComponent < ChatBoxProps > {
  static tagName = "aurora-chatbox";
  
  private headerRef = createElementRef();
  private listMsg = createElementRef();
  private attachedContentRef = createElementRef();
  private messageRef = createElementRef();
  private emptyPlaceholder = createElementRef();
  private attachedContents = [];
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
  
  takePhoto() {
    this.warp(
      <TakePhotoModal context={this.props.context}/>,
      document.body
    );
  }
  
  scrollToBottom() {
    requestAnimationFrame(() => {
      const el = isMobileView() ? window : this.listMsg.target;
      el.scrollTo({
        top: el === window ? document.documentElement.scrollHeight : (el as HTMLElement).scrollHeight,
        behavior: 'smooth'
      });
    });
  }
  
  attachedImage(data: any) {
    this.attachedContents.push(data);
    this.attachedContentRef.addChild(this.render(
      <img src={data}/>
    ))
  }
  
  onCreate() {
    this.props.context.on("msg", (msg: MessageInfo) => this.addMessage(msg));
    this.props.context.on("error", () => this.addNote("An error occurred "));
    this.props.context.on("chat:input:attach:image", (data: any) => this.attachedImage(data));
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
    ChatService.sendMsgText(
      ctx, 
      ctx.get("user") !,
      msg,
      this.attachedContents[0] as string
    );
    this.messageRef.value = "";
    this.attachedContentRef.text = ""
  }
  
  template() {
    return (
      <Fragment>
        <div ref={this.headerRef} class="chatbox-header p-3 d-flex align-center">
          <h4>Chat</h4>
          <span class="ml-auto  d-flex align-center">
            <button on:click={()=> this.takePhoto()}class="ml-auto btn btn-icon material-icons">add_a_photo</button>
            <button class="ml-auto btn btn-icon material-icons">add</button>
            <button class="ml-auto open-canvas-btn btn btn-icon material-icons" on:click={()=> this.props.context.emit("canvas:open",null)}>menu_open</button>
          </span>
        </div>
        
        <div ref={this.listMsg} class="chatbox-contents p-3">
          <span ref={this.emptyPlaceholder}>
            <EmptyPlaceholder 
              content="Everything is ready, let's start your conversation  " 
              icon="forum"
            />
          </span>
        </div>
        <div class="chatbox-input p-2">
          <div class="attached-preview" ref={this.attachedContentRef} class="attached-preview mb-2"></div>
          <div class="input-bar d-flex align-center gap-2">
            <button on:click={()=> this.takePhoto()} class="btn btn-icon material-icons">add</button>
            <input ref={this.messageRef} type="text" class="form-input flex-1" placeholder="Type message ..." />
            <button on:click={() => this.onSendBtnClick()} class="btn btn-icon material-icons">send</button>
          </div>
        </div>
    </Fragment>
    );
  }
}