import { io, Socket } from 'socket.io-client';

const socket: Socket = io(process.env.BACKEND_HOST as string);

socket.on('connect', () => {
  console.log('Socket connected:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
});

export class SocketService {
  static sendMsg < T = any > (topic: string, data: T): void {
    socket.emit(topic, data);
  }
  
  static listen < T = any > (topic: string, callback: (data: T) => void): void {
    socket.on(topic, callback);
  }
  

  static unlisten < T = any > (topic: string, callback: (data: T) => void): void {
    socket.off(topic, callback);
  }
}