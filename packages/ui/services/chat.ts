import { RumiousContext } from 'rumious';
import {
  ChatData,
  UserInfo,
  CanvasObject,
  MessageInfo,
  CanvasModes,
  CanvasChangeCommit
} from '../types/index.js';
import { SocketService } from './socket.js';

export class ChatService {
  
  static initChat(
    context: RumiousContext < ChatData > ,
    user: UserInfo
  ): Promise < boolean > {
    return new Promise((resolve) => {
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
      
      SocketService.sendMsg('chat:init', { user });
    });
  }
  
  static async listenMsg(
    context: RumiousContext < ChatData >
  ) {
    SocketService.listen('chat:send:error', (data: Error) => {
      context.emit('error', data);
    });
    
    SocketService.listen('chat:reply', (chatData: MessageInfo) => {
      context.get('messages') !.push(chatData);
      context.emit('msg', chatData);
    });
    
    SocketService.listen('chat:canvas:mode:change', ({ mode }: { mode: CanvasModes }) => {
      this.changeCanvas(context, mode);
    });
    
    SocketService.listen("chat:canvas:read", () => context.emit("canvas:read",{}));
SocketService.listen("chat:canvas:write", (commit:CanvasChangeCommit) => context.emit("canvas:write",commit));

    context.on('canvas:content',(data: any)=> SocketService.sendMsg('chat:canvas:content',data))
  }
  
  static async sendMsgText(
    context: RumiousContext < ChatData > ,
    sender: UserInfo,
    text: string | string[]
  ): Promise < boolean > {
    const chatData = {
      id: Date.now().toString(32),
      sender,
      contents: typeof text === 'string' ? [text] : text
    };
    
    context.get('messages') !.push(chatData);
    context.emit('msg', chatData);
    
    SocketService.sendMsg('chat:send', chatData);
    
    return true;
  }
  
  static async changeCanvas(
    context: RumiousContext < ChatData > ,
    mode: CanvasModes
  ) {
    context.get("canvas") !.mode = mode;
    context.emit('canvas:mode:change', mode);
  }
}