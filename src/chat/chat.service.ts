import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
// import { Users } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
// import { Messages } from './entities/message.entity';
// import { Messages } from './entities/message.entity';
@Injectable()
export class ChatService {
  constructor(
    private readonly userService: UsersService,
    // @InjectRepository(Messages)
    // private readonly messagesRepository: Repository<Messages>,
  ) {}
  async getUserFromSocket(socket: Socket) {
    const header = socket.handshake.headers;
    const token = header?.authorization?.split(' ')[1];
    if (token) {
      const user = await this.userService.verify(token);
      // console.log(user);
      return user;
    } else {
      throw new NotFoundException();
    }
  }
  // async saveMessage(message: string, authorId: string) {
  //   console.log('--------->>', authorId);
  //   const newMessage = await this.messagesRepository.save({ message, authorId });
  //   console.log('--------->>', newMessage);
  //   // await this.messagesRepository.save(newMessage);
  //   return newMessage;
  // }
}