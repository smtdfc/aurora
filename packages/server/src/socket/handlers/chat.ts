import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Socket } from 'socket.io';
import {
  initModel,
  createChat
} from 'aurora-ai-helper';

import { MessageInfo } from '../../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../.env")
});

if (!process.env.GOOGLE_API_KEY) {
  throw Error("Cannot find Google Gemini API key !")
}

const model = initModel(
  process.env.GOOGLE_API_KEY
);

export class SocketChatChannelHandler {
  static onChatInit(socket: Socket, data: any) {
    socket.data.chat = createChat(
      model,
      {
        state: {
          canvas: {
            mode: "text"
          }
        },
        onRequestWriteCanvas: async (contentType: string, content: string) => await SocketChatChannelHandler.onRequestWriteCanvas(socket, contentType, content),
        onRequestReadCanvas: async () => await SocketChatChannelHandler.onRequestReadCanvas(socket),
        onCanvasModeChange: (mode: string) => SocketChatChannelHandler.onCanvasModeChange(socket, mode)
      }
    );
    socket.emit('chat:init:success', {});
  }
  
  static onRequestWriteCanvas(
    socket: Socket,
    contentType: string,
    content: string
  ): void {
    if (!socket.data.chat) {
       socket.emit('chat:send:error', {
        message: "Something was wrong !"
      });

    } else {
       socket.emit('chat:canvas:write', {
        type: contentType,
        content
      });
    }
    return;
  }
  
  
  static onRequestReadCanvas(
    socket: Socket
  ): Promise < any > {
    if (!socket.data.chat) {
      socket.emit('chat:send:error', {
        message: "Something was wrong !"
      });
    }
    
    return new Promise((rs, rj) => {
      socket.on('chat:canvas:content', (content) => rs(content));
      socket.emit('chat:canvas:read', {});
    });
  }
  
  static onCanvasModeChange(socket: Socket, mode: string) {
    if (!socket.data.chat) {
      socket.emit('chat:send:error', {
        message: "Something was wrong !"
      });
    }
    
    socket.emit('chat:canvas:mode:change', {
      mode
    });
  }
  
  static onMsgSent(socket: Socket, data: MessageInfo) {
    if (!socket.data.chat) {
      socket.emit('chat:send:error', {
        message: "Something was wrong !"
      });
    }
    
    socket.data.chat.send({
        prompt: data.contents.join("\n")
      })
      .then((response: any) => {
        let reply: MessageInfo = {
          id: Date.now().toString(32),
          sender: {
            id: "model",
            name: "Aurora Assistant ",
            role: "Model"
          },
          contents: [
            response.text
          ]
        };
        socket.emit('chat:reply', reply);
      })
      
      .catch((err: Error) => {
        console.log(err);
        socket.emit('chat:send:error', {
          message: "Model cannot response now !"
        });
      })
    
  }
}