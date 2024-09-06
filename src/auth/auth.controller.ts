import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/create-auth.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() credentialsRequest: CredentialsDto) {
    return this.authService.create(credentialsRequest);
  }

  @Post('login')
  login(@Body() credentialsRequest: CredentialsDto) {
    return this.authService.login(credentialsRequest);
  }

  @Get('free')
  free() {
    return 'Free!';
  }

  @Get('protected')
  @UseGuards(AuthGuard)
  protected() {
    return 'You have access!';
  }
}
