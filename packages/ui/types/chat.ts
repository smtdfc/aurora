import {CanvasObject,CanvasModes} from './canvas.js';
import {UserInfo} from './user.js';

export interface MessageInfo{
  id: string,
  sender:UserInfo,
  contents: string[]
}


export interface ChatData{
  messages:MessageInfo[];
  title: string;
  canvas:{
    mode:CanvasModes,
    value?:any
  };
  user:UserInfo;
}