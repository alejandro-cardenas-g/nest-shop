import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { META_ROLES } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const validRoles: string[] =
      this.reflector.get(META_ROLES, context.getHandler()) || [];
    if (validRoles.length === 0) return true;
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;
    if (!user)
      throw new InternalServerErrorException('User not found (request)');
    const validation = validRoles.some((role) => user.roles.includes(role));
    if (!validation) {
      throw new ForbiddenException(
        `The user need a valid role: [${validRoles}]`,
      );
    }
    return validation;
  }
}
