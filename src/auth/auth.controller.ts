import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Request,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { IncomingHttpHeaders } from 'http';
import { AuthService } from './auth.service';
import { Auth, GetUser, RawHeader, RoleProtected } from './decorators';
import { CreateUserDto, SignInUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { EValidRoles } from './interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('sign-in')
  signIn(@Body() signInUserDto: SignInUserDto) {
    return this.authService.signIn(signInUserDto);
  }

  @Get('check-auth')
  @Auth()
  refreshToken(@GetUser() user: User) {
    return this.authService.checkStatus(user.id);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Request() req: Express.Request,
    @GetUser('id') userId: any,
    @GetUser() user: any,
    @RawHeader() rawHeaders: any,
    @Headers() headers: IncomingHttpHeaders,
  ) {
    return { user, userId, rawHeaders, headers };
  }

  @Get('private2')
  @SetMetadata('roles', ['admin', 'super-user'])
  @UseGuards(AuthGuard(), UserRoleGuard)
  testingPrivateRoute2(@GetUser() user: any) {
    return { user };
  }

  @Get('private3')
  @RoleProtected(EValidRoles.admin, EValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  testingPrivateRoute3(@GetUser() user: any) {
    return { user };
  }

  @Get('private4')
  @Auth(EValidRoles.admin)
  testingPrivateRoute4(@GetUser() user: any) {
    return { user };
  }
}
