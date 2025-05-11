import { RumiousComponent, Fragment, createElementRef, RumiousContext, createState, RumiousState } from 'rumious';
import { MessageInfo, ChatData } from '../types/index.js';
import { ChatService } from '../services/chat.js';

function isMobileView(breakpoint = 768): boolean {
  return window.innerWidth <= breakpoint;
}

interface ChatBoxProps {
  context: RumiousContext < ChatData >
}

export class ChatBox extends RumiousComponent < ChatBoxProps > {
  static tagName = "smtdfc-chatbox";
  private headerRef = createElementRef();
  private listMsg=createElementRef();
  private messageRef = createElementRef();
  constructor() {
    super();
  }
  
  addMessage(msg: MessageInfo) {
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
         {msg.contents.map((item) => <span>{item}</span>)}
      </div>
    </div>
    ));
    requestAnimationFrame(() => {
      if (isMobileView()) {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });
      } else {
        const scrollElement = this.listMsg.target;
        scrollElement.scrollTo({
          top: scrollElement.scrollHeight,
          behavior: 'smooth'
        });
      }
    });
  }
  
  onCreate() {
    this.props.context.on("msg", (msg: MessageInfo) => this.addMessage(msg));
  }
  
  onRender() {
    if (isMobileView()) {
      window.addEventListener("scroll", (e: Event) => {
        if (window.scrollY > 100) {
          this.headerRef.addClasses('sticky');
        } else {
          this.headerRef.removeClasses('sticky');
        }
      });
    }
    let context = this.props.context;
    let messages = context.get("messages") !;
    for (let msg of messages) {
      this.addMessage(msg);
    }
  }
  
  onSendBtnClick() {
    if(!this.messageRef.value) return;
    let context = this.props.context;
    ChatService.sendMsgText(
      context,
      context.get("user") !,
      this.messageRef.value
    );
    this.messageRef.value="";
  }
  
  template() {
    return (
      <Fragment>
        <div ref={this.headerRef} class="chatbox-header p-3 d-flex align-center ">
          <h4>Chat</h4>
          <button class="ml-auto btn btn-icon material-icons" >add</button>
        </div>
        <div class="chatbox-contents p-3" ref={this.listMsg} />
        <div class="chatbox-input d-flex flex-column align-center justify-between" >
          <button class="btn btn-icon material-icons">add</button>
          <input ref={this.messageRef} placeholder="Type message ..." type="text" class="form-input" />
          <button on:click={()=> this.onSendBtnClick()} class="btn btn-icon material-icons">send</button>
        </div>
      </Fragment>
    );
  }
}