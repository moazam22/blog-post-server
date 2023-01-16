import { User } from '../entities/user.entity';

export class ContextUser {
  email: string;
  sub: string;
  iat: Number;
  exp: Number;
  currentUser: User;
}
