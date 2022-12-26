import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets/decorators';
import { Server, Socket } from 'socket.io';
import { IJwtPayload } from '../auth/interfaces';
import { NewMessageDto } from './dto/new-message.dto';
import { MessagesWsService } from './messages-ws.service';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() private readonly wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket, ...args: any[]) {
    let token = client.handshake.headers.authorization as string;
    token = token.split('Bearer ')[1];
    let payload: IJwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (e) {
      client.disconnect();
      return;
    }

    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);
  }

  @SubscribeMessage('message-from-client')
  messageFromClient(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: NewMessageDto,
  ) {
    // notificar la cliete que envió el evento
    // client.emit('messages-updated', {
    //   fullName: 'carlos',
    //   message: payload.message,
    // });

    // notificar a todos menos a quien envió el mensaje
    // client.broadcast.emit('messages-updated', {
    //   fullName: 'carlos',
    //   message: payload.message,
    // });

    // notificar a todos a los clientes
    this.wss.emit('messages-updated', {
      fullName: this.messagesWsService.getUserFullNameBySocketId(client.id),
      message: payload.message,
    });
  }
}
