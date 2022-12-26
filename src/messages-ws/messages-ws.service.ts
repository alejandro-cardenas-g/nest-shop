import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { UserRepository } from 'src/auth/repositories/user.repositiory';

interface IConnectedClient {
  [id: string]: {
    socket: Socket;
    user: User;
  };
}

@Injectable()
export class MessagesWsService {
  constructor(private readonly userRepository: UserRepository) {}

  private connectedClients: IConnectedClient = {};

  async registerClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new Error('User not found');
    if (!user.isActive) throw new Error('User not active');
    this.checkDuplicateConnection(user);
    this.connectedClients[String(client.id)] = {
      socket: client,
      user,
    };
  }

  removeClient(clientId: string) {
    delete this.connectedClients[String(clientId)];
  }

  getConnectedClients(): string[] {
    return Object.values(this.connectedClients).map(
      ({ user }) => user.fullName,
    );
  }

  getUserFullNameBySocketId(socketId: string) {
    return this.connectedClients[socketId].user.fullName;
  }

  private checkDuplicateConnection(user: User) {
    for (const [key, connectedClient] of Object.entries(
      this.connectedClients,
    )) {
      if (connectedClient.user.id === user.id) {
        this.connectedClients[key].socket.disconnect();
        break;
      }
    }
  }
}
