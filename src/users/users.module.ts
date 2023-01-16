import { JwtModule } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { UserSubscriber } from './subscribers/user.subscriber';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { SearchModule } from 'src/elastic-search/elastic-search.module';
import UserESProvider from './user-es.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRY') },
      }),
      inject: [ConfigService],
    }),
    SearchModule,
  ],
  providers: [UsersResolver, UsersService, UserSubscriber, UserESProvider],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
