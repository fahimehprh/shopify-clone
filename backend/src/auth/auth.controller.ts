import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    const token = this.authService.login(req.user.id);

    return { ...req.user, token };
  }
}
