import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() credentialsRequest: CredentialsDto) {
    return this.authService.create(credentialsRequest);
  }

  @Post('login')
  login(@Body() credentialsRequest: CredentialsDto) {
    return this.authService.login(credentialsRequest);
  }
}
