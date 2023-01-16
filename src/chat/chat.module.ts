import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
// import { Messages } from './entities/message.entity';
@Module({
  imports: [UsersModule],
  exports: [],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}