import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
@WebSocketGateway(8000, {
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(private readonly chatService: ChatService) { }
  private users: Map<string, object> = new Map();
  async handleConnection(socket: Socket) {
    const user = await this.chatService.getUserFromSocket(socket);

    this.users.set(user.currentUser.id, { socketId: socket.id, name: `${user.currentUser.firstName} ${user.currentUser.lastName}` });
    const onlineUsers = Array.from(this.users, (entry) => {
      return { userId: entry[0], data: entry[1] };
    });
    this.server.sockets.emit('onlineUsers', { users: onlineUsers });
    console.log(`user ${user.currentUser.firstName + ' ' + user.currentUser.lastName} is connectd`);
  }
  async handleDisconnect(socket: Socket) {
    const user = await this.chatService.getUserFromSocket(socket);
    const myMap: any = this.users;
    if (myMap.has(user?.userId)) {
      myMap.delete(user?.userId);
    }

    const onlineUsers = Array.from(myMap, (entry: any) => {
      return { userId: entry[0], data: entry[1] };
    });
    this.server.sockets.emit('onlineUsers', { users: onlineUsers });


    console.log(`user ${user.currentUser.firstName + ' ' + user.currentUser.lastName} is disconnected`);
  }
  @SubscribeMessage('sendMessage')
  async listenForMessages(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    const author = await this.chatService.getUserFromSocket(socket);
    this.server.sockets.emit('receiveMessage', { data, author });
  }
  @SubscribeMessage('joinRoom')
  joinRoom(client: Socket, room: string): void {
    client.join(room);
    client.emit('joinRoom', room);
    console.log('test-backend');
  }
  @SubscribeMessage('private')
  async handlePrivateMessage(socket: Socket, message: { to: string; content: string }) {
    const user = await this.chatService.getUserFromSocket(socket);
    const senderId = user.userId
    const users: {} | undefined | any = this.users.get(message.to)
    const { socketId } = users;
    if (!!socketId) {
      this.server.to(socketId).emit('private', { message: message.content, senderId: senderId });
    }
  }
}