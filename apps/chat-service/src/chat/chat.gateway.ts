import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    client.join(userId);
  }

  @SubscribeMessage('send_message')
  async handleMessage(client: Socket, payload: any) {
    const { to, from, content } = payload

    this.server.to(to).emit('receive_message', 'saved');
  }
}
