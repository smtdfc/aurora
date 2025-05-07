import {
  RumiousContext
} from 'rumious';
import { ChatData,UserInfo } from '../types/index.js';


export class ChatService {
  static async sendMsgText(
    context: RumiousContext < ChatData > ,
    sender: UserInfo,
    text: string | string[]
  ): Promise < boolean > {
    let chatData = {
      id: (Date.now()).toString(32),
      sender,
      contents: typeof text === "string" ? [text] : text
    };
    
    context.get("messages")!.push(chatData);
    context.emit("msg",chatData);
    return true;
  }
}