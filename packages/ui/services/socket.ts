import { io } from 'socket.io-client'

const socket = io(process.env.BACKEND_HOST)

socket.on('connect', () => {
  
})

socket.on('message', (msg) => {
  console.log(msg);
})


export class SocketService{
  static async sendMsg(topic: string,data:any){
    socket.emit(
      topic,
      data
    );
  }
}