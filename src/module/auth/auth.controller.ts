import { Controller, Get, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from '../../decorator/public.decorator';
import { BaseResponse } from '../../helper';
import { UsersService } from '../users/users.service';

@Controller('api')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @UseGuards(ThrottlerGuard)
  @Post('login')
  async login(@Req() req: any, @Res() res: Response) {
    const access_token = await this.authService.login(req.user);

    if (!access_token) {
      return res.status(401).json(BaseResponse.unauthorizedResponse("Your account has been deactivated."));
    }

    return res.status(200).json(BaseResponse.encodeData(access_token, 200));
  }

  @Get('profile')
  async getProfile(@Request() req: any) {
    const user = await this.usersService.profile(req.user.userId);
    return new BaseResponse(200, undefined, undefined, user);
  }

  // TODO: Implement register
  // TODO: Implement forgot password
  // TODO: Implement reset password
  // TODO: Implement change password
  // TODO: Implement change email
  // TODO: Implement change phone
  // TODO: Implement change username
  // TODO: Implement change profile
}
