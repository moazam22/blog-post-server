import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Injectable()
export class JwtAuthGraphQLGuard extends AuthGuard('jwt') {
  constructor(private userService: UsersService) {
    super();
  }

  /**
   * Determines whether activate can
   * @param context
   * @returns activate
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    if (!ctx.req.headers.authorization) {
      return false;
    }
    ctx.user = await this.validateToken(ctx.req.headers.authorization);
    return true;
  }

  async validateToken(auth: string) {
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new HttpException(
        'Invalid Authorization Token - No Token Provided in Headers',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const token = auth.split(' ')[1];
    try {
      return this.userService.verify(token);
    } catch (err) {
      throw new HttpException(
        'Invalid Authorization Token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
