import { Server } from 'socket.io'
import { Server as HttpServer } from 'http'

export default function(httpServer:HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*'
    }
  })
  
  
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)
    
    socket.on('message', (data) => {
      console.log('Received:', data)
      io.emit('message', data)
    })
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })
  
}