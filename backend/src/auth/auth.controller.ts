import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.register(email, password);
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(email, password, response);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res() res: Response) {
    res.clearCookie('jwt');
    return res.status(200).json({ message: 'Logged out successfully' });
  }
}
