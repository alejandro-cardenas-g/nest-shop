import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { UserRepository } from '../repositories/user.repositiory';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: IJwtPayload): Promise<User> {
    const { id } = payload;
    if (!id) throw new UnauthorizedException('Token is not valid');
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new UnauthorizedException('Token is not valid');
    if (!user.isActive) throw new UnauthorizedException('User is not active');
    return user;
  }
}
