import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.dto';
import { CreatedUser } from './dto/created-user.dto';
import { ResponseMsgPayload } from './dto/response-message.dto';
import { ResetPasswordDto, UpdateUserInput } from './dto/update-user.dto';
import { PaginateInput } from './dto/user-common.dto';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ForgotPassword } from './dto/forgot-password.dto';
import UserESProvider from './user-es.provider';

interface NewType {
  [key: string]: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private userESProvider: UserESProvider,
  ) {}

  /**
   * Finds user
   * @param value
   * @returns user
   */
  async findUser(value: NewType): Promise<User> {
    const user = await this.usersRepository.findOneBy(value);
    if (user) {
      return user;
    }
    throw new HttpException('User Not Found!', HttpStatus.NOT_FOUND);
  }

  /**
   * Users exist
   * @param value
   * @returns exist
   */
  async userExist(value: NewType): Promise<User | null> {
    return await this.usersRepository.findOneBy(value);
  }

  /**
   * Fetchs all users
   * @param {
   *     limit = 10,
   *     page = 1,
   *   }
   * @returns all users
   */
  async fetchAllUsers({
    limit = 10,
    page = 1,
  }: PaginateInput): Promise<[User[], number]> {
    const skip = (page - 1) * limit;
    return await this.usersRepository.findAndCount({
      order: {
        createdAt: 'ASC',
      },
      skip: skip,
      take: limit,
    });
  }

  /**
   * Creates user
   * @param userPayload
   * @returns user
   */
  async createUser(userPayload: CreateUserInput): Promise<CreatedUser> {
    let user = await this.usersRepository.findOneBy({
      email: userPayload?.email,
    });
    if (!user) {
      const user = await this.usersRepository.save({
        ...userPayload,
      });
      const access_token = await this.createToken(user);
      return { user, access_token };
    }
    throw new HttpException(
      'This email address already exist!',
      HttpStatus.NOT_ACCEPTABLE,
    );
  }

  /**
   * Updates user
   * @param updateUserPayload
   * @returns user
   */
  async updateUser(
    updateUserPayload: UpdateUserInput,
  ): Promise<ResponseMsgPayload> {
    const { id, ...result } = updateUserPayload;
    await this.findUser({ id: updateUserPayload?.id });
    await this.usersRepository.update(updateUserPayload?.id, {
      ...result,
    });
    await this.userESProvider.updateUserES({
      firstName: updateUserPayload?.firstName,
      lastName: updateUserPayload?.lastName,
      userId: updateUserPayload?.id,
    });
    return { message: 'Successfully Updated!', status: HttpStatus.OK };
  }

  /**
   * Deletes user
   * @param id
   * @returns user
   */
  async deleteUser(id: string): Promise<ResponseMsgPayload> {
    await this.findUser({ id });
    await this.usersRepository.delete(id);
    return { message: 'Successfully Deleted!', status: HttpStatus.OK };
  }

  /**
   * Updates user password and token
   * @param payload
   * @returns user password and token
   */
  async updateUserPasswordAndToken(payload: ResetPasswordDto): Promise<void> {
    try {
      const { id, ...result } = payload;
      await this.usersRepository.update(id, {
        password: result?.password,
        resetPasswordToken: '',
        resetPasswordTokenExpiredAt: null,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // Authentication service login
  /**
   * Verifys auth service
   * @param token
   * @returns
   */
  async verify(token: string) {
    const tokenDetail = await this.jwtService.verify(token);
    const user = await this.findUser({ id: tokenDetail.userId });
    return { ...tokenDetail, currentUser: user };
  }

  /**
   * Creates token
   * @param user
   * @param password
   * @returns token
   */
  async validateUser(
    user: User,
    password: string,
  ): Promise<{ access_token: string }> {
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const payload = { email: user.email, userId: user.id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new HttpException(
      'Invalid email or password!',
      HttpStatus.NOT_ACCEPTABLE,
    );
  }

  /**
   * Forgots password
   * @param user
   * @returns password
   */
  async forgotPassword(user: User): Promise<ForgotPassword> {
    let resetPasswordTokenExpiredAt: Date = new Date();
    const resetPasswordToken = Math.random().toString(36).substring(2);
    resetPasswordTokenExpiredAt.setDate(
      resetPasswordTokenExpiredAt.getDate() + 1,
    );
    await this.updateUser({
      id: user?.id,
      resetPasswordToken,
      resetPasswordTokenExpiredAt,
    });
    return { userKey: resetPasswordToken };
  }

  /**
   * Updates password
   * @param user
   * @param password
   * @returns password
   */
  async updatePassword(
    user: User,
    password: string,
  ): Promise<ResponseMsgPayload> {
    try {
      const newPassword = await bcrypt.hash(password, await bcrypt.genSalt());
      await this.updateUserPasswordAndToken({
        id: user?.id,
        password: newPassword,
      });
      return {
        status: HttpStatus.OK,
        message: 'Password successfully updated !',
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Creates token
   * @param user
   * @returns token
   */
  async createToken(user: User): Promise<string> {
    return this.jwtService.sign({ email: user.email, userId: user.id });
  }
}
