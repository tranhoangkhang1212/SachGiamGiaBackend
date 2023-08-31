import { BaseService } from '@common/services/base.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatService extends BaseService {
  @WebSocketServer() server: Server;
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {
    super();
    this._entity = Chat;
    this._model = this.chatRepository;
  }

  async handleMessage(payload: { name: string; age: number }) {
    const data = await this.chatRepository.find();
    this.server.emit('initMsgToClient', data);
    if (payload) {
      this.server.emit('msgToClient', payload.name);
      this.chatRepository.save({ message: payload.name });
    }
  }
}
