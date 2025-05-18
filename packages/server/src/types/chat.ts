import { UserInfo } from './user.js';

export interface MessageInfo {
  id: string,
  sender: UserInfo,
  contents: string[],
  image: string | null
}


export interface ChatData {
  messages: MessageInfo[];
  title: string;
  user: UserInfo;
}