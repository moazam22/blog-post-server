import { PostSearchBody } from './../post/dto/es-dto';

import { AllUsersDto, PaginateInput } from './dto/user-common.dto';
import { ResponseMsgPayload } from './dto/response-message.dto';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { CreateUserInput } from './dto/create-user.dto';
import { UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { CreatedUser } from './dto/created-user.dto';
import { UpdateUserInput } from './dto/update-user.dto';

import { JwtAuthGraphQLGuard } from './jwt-auth-graphql.guard';
import { ForgotPassword, UpdatePasswordInput } from './dto/forgot-password.dto';
import { AccessUserPayload } from './dto/access-user.dto';
import { LoginUserInput } from './dto/login-input.dto';
import { ContextUser } from './dto/context-user.dto';
import { CurrentUser } from 'src/customDecorators/current-user.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Querys users resolver
   * @param id
   * @returns user by id
   */
  @Query(() => User)
  @UseGuards(JwtAuthGraphQLGuard)
  async findUserById(@Args('userId') userId: string): Promise<User> {
    return await this.usersService.findUser({ id: userId });
  }

  @Query(() => AllUsersDto)
  @UseGuards(JwtAuthGraphQLGuard)
  async fetchAllUser(
    @Args('paginateInput') paginateInput: PaginateInput,
  ): Promise<{ users?: User[]; count?: number }> {
    let [users, count] = await this.usersService.fetchAllUsers({
      ...paginateInput,
    });
    return {
      users,
      count,
    };
  }

  /**
   * Mutations users resolver
   * @param createUserInput
   * @returns user
   */
  @Mutation(() => CreatedUser)
  @UseGuards(JwtAuthGraphQLGuard)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<CreatedUser> {
    return await this.usersService.createUser(createUserInput);
  }

  /**
   * Mutations users resolver
   * @param updateUserInput
   * @returns user
   */
  @Mutation(() => ResponseMsgPayload)
  @UseGuards(JwtAuthGraphQLGuard)
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<ResponseMsgPayload> {
    return await this.usersService.updateUser(updateUserInput);
  }

  /**
   * Mutations users resolver
   * @param userId
   * @returns user
   */
  @Mutation(() => ResponseMsgPayload)
  @UseGuards(JwtAuthGraphQLGuard)
  async deleteUser(
    @Args('userId') userId: string,
  ): Promise<ResponseMsgPayload> {
    return await this.usersService.deleteUser(userId);
  }

  // Auth implementation
  /**
   * Mutations auth resolver
   * @param loginUserInput
   * @returns login
   */
  @Mutation((returns) => AccessUserPayload)
  async login(
    @Args('loginUser') loginUserInput: LoginUserInput,
  ): Promise<AccessUserPayload> {
    const { email, password } = loginUserInput;
    const user = await this.usersService.userExist({ email: email.trim() });

    if (user) {
      return this.usersService.validateUser(user, password);
    }
    throw new HttpException('Invalid email or password!', HttpStatus.NOT_FOUND);
  }

  /**
   * Mutations auth resolver
   * @param email
   * @returns password
   */
  @Mutation((returns) => ForgotPassword)
  async forgotPassword(@Args('email') email: string): Promise<ForgotPassword> {
    const user = await this.usersService.findUser({ email: email.trim() });
    if (user) {
      return await this.usersService.forgotPassword(user);
    }
    throw new HttpException('Email is not found !', HttpStatus.NOT_FOUND);
  }

  /**
   * Mutations auth resolver
   * @param passwordUpdateInput
   * @returns password
   */
  @Mutation((returns) => ResponseMsgPayload)
  async updatePassword(
    @Args('passwordUpdateInput') passwordUpdateInput: UpdatePasswordInput,
  ): Promise<ResponseMsgPayload> {
    const user = await this.usersService.findUser({
      resetPasswordToken: passwordUpdateInput?.userKey,
    });
    if (user) {
      const date = new Date();
      const expiryDate =
        user?.resetPasswordTokenExpiredAt &&
        new Date(user.resetPasswordTokenExpiredAt);
      if (expiryDate && expiryDate < date) {
        throw new HttpException('Token is expired!', HttpStatus.NOT_ACCEPTABLE);
      } else {
        return await this.usersService.updatePassword(
          user,
          passwordUpdateInput.password,
        );
      }
    }
    throw new HttpException(
      'User Not Found Against This UserKey!',
      HttpStatus.NOT_FOUND,
    );
  }

  /**
   * Mutations auth resolver
   * @param signUpUserInput
   * @returns up
   */
  @Mutation((returns) => CreatedUser)
  async signUp(
    @Args('signUpUserInput') signUpUserInput: CreateUserInput,
  ): Promise<CreatedUser> {
    return await this.usersService.createUser(signUpUserInput);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGraphQLGuard)
  async getCurrentUser(@CurrentUser() user: ContextUser): Promise<User> {
    return user.currentUser;
  }
}
