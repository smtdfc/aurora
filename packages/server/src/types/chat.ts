import { CanvasObject } from 'aurora-ai-helper';
import { UserInfo } from './user.js';

export interface MessageInfo {
  id: string,
  sender: UserInfo,
  contents: string[]
}


export interface ChatData {
  messages: MessageInfo[];
  title: string;
  objects: CanvasObject[];
  user: UserInfo;
}