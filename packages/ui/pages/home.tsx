import {
  RumiousComponent,
  Fragment,
  createElementRef,
  createContext
} from 'rumious';
import { RumiousRouterPageProps } from 'rumious-router';
import { Canvas } from '../components/Canvas.jsx';
import { ChatBox } from '../components/ChatBox.jsx';
import { ChatData } from '../types/chat.jsx';


export class Page extends RumiousComponent < RumiousRouterPageProps > {
  private embedElement = createElementRef();
  private chatContext = createContext < ChatData > ({
    title:"Chat #1",
    messages:[],
    canvas:{
      mode:"text"
    },
    user:{
      name:"User #1",
      id:Date.now().toString(32),
      role:"User"
    }
  });
  
  constructor() {
    super();
  }
  
  template() {
    return (
      <Fragment>
        <div class="panel" style="margin-top: 1rem;">
          <div class="content" >
            <ChatBox context={this.chatContext}/>
          </div>
          <div ref={this.embedElement} class="content">
            <Canvas context={this.chatContext}/>
          </div>
        </div>
      </Fragment>
    );
  }
}