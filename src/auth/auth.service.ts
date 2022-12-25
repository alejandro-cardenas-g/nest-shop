import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcrypt';
import { pick } from 'lodash';
import { CreateUserDto, SignInUserDto } from './dto';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { UserRepository } from './repositories/user.repositiory';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto);
      user.password = hashSync(user.password, 10);
      await this.userRepository.save(user);
      return {
        ...pick(user, ['email']),
        access_token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async signIn(signInUserDto: SignInUserDto) {
    const { email, password } = signInUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });
    if (!user)
      throw new UnauthorizedException('Credentials are not valid (Email)');
    const validation = compareSync(password, user.password);
    if (!validation)
      throw new UnauthorizedException('Credentials are not valid (Password)');
    delete user.password;
    return {
      ...pick(user, ['email']),
      access_token: this.getJwtToken({ id: user.id }),
    };
  }

  async checkStatus(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: { email: true, id: true },
    });
    if (!user)
      throw new UnauthorizedException('Credentials are not valid (Email)');
    return {
      ...pick(user, ['email']),
      access_token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: IJwtPayload) {
    return this.jwtService.sign(payload, { expiresIn: '24h' });
  }

  private handleDbErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail || '');
    }
    throw new InternalServerErrorException('');
  }
}
