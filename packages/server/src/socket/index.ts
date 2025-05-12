import { Server } from 'socket.io'
import { Server as HttpServer } from 'http'
import {SocketChatChannelHandler} from './handlers/chat.js';


export default function(httpServer:HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*'
    }
  })
  
  
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)
    
    socket.on('chat:init', (data) => SocketChatChannelHandler.onChatInit(socket,data));
    socket.on('chat:send', (data) => SocketChatChannelHandler.onMsgSent(socket,data));
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })
  
}