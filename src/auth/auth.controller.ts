import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() credentials: AuthCredentialsDto) {
    return this.authService.signup(credentials);
  }

  @Post('/signin')
  signIn(@Body() credentials) {
    return this.authService.signin(credentials);
  }
}
