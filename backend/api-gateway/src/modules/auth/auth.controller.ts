import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FetchProxyService } from 'src/common/proxy/fetch-proxy.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly proxy: FetchProxyService,
  ) {}

  @Post('pre-register') //+
  async preRegister(@Body() body: any, @Req() req) {
    console.log('💬 GATEWAY BODY:', body);
    const url = `${this.configService.get('AUTH_SERVICE_URL')}/auth/pre-register`;
    return this.proxy.forward('POST', url, body, req.headers);
  }

  @Get('verify-registration') //+
  async verifyRegistration(@Query('token') token: string, @Req() req) {
    const url = `${this.configService.get('AUTH_SERVICE_URL')}/auth/verify-registration?token=${token}`;
    return this.proxy.forward('GET', url, null, req.headers);
  }

  // @Post('login') //+
  // async login(@Body() body: any, @Req() req) {
  //   const url = `${this.configService.get('AUTH_SERVICE_URL')}/auth/login`;
  //   return this.proxy.forward('POST', url, body, req.headers);
  // }
  @Post('login') //+
  async login(@Body() body: any, @Req() req, @Res() res) {
    const url = `${this.configService.get('AUTH_SERVICE_URL')}/auth/login`;
    const result = await this.proxy.forward(
      'POST',
      url,
      body,
      req.headers,
      res,
    );
    return res.send(result); // обязательно вручную отправить ответ
  }

  @Get('protected') //+
  async getProtected(@Req() req) {
    const url = `${this.configService.get('AUTH_SERVICE_URL')}/auth/protected`;
    return this.proxy.forward('GET', url, null, req.headers);
  }

  @Post('refresh') //+
  async refresh(@Body() body: any, @Req() req) {
    const url = `${this.configService.get('AUTH_SERVICE_URL')}/auth/refresh`;
    return this.proxy.forward('POST', url, body, req.headers);
  }
  // @Post('refresh')
  // async refresh(@Req() req, @Res() res) {
  //   const url = `${this.configService.get('AUTH_SERVICE_URL')}/auth/refresh`;
  //   const result = await this.proxy.forward(
  //     'POST',
  //     url,
  //     null,
  //     req.headers,
  //     res,
  //   );
  //   return res.send(result);
  // }

  @Post('logout') //+
  async logout(@Req() req) {
    const url = `${this.configService.get('AUTH_SERVICE_URL')}/auth/logout`;
    return this.proxy.forward('POST', url, null, req.headers);
  }
  // @Post('logout')
  // async logout(@Req() req, @Res() res) {
  //   const url = `${this.configService.get('AUTH_SERVICE_URL')}/auth/logout`;
  //   const result = await this.proxy.forward(
  //     'POST',
  //     url,
  //     null,
  //     req.headers,
  //     res,
  //   );
  //   return res.send(result);
  // }

  @Patch('change-password') //+
  async changePassword(@Body() body: any, @Req() req) {
    const url = `${this.configService.get('AUTH_SERVICE_URL')}/auth/change-password`;
    return this.proxy.forward('PATCH', url, body, req.headers);
  }

  @Post('forgot-password') //+
  async forgotPassword(@Body() body: any, @Req() req) {
    const url = `${this.configService.get('AUTH_SERVICE_URL')}/auth/forgot-password`;
    return this.proxy.forward('POST', url, body, req.headers);
  }

  @Post('reset-password') //+
  async resetPassword(@Body() body: any, @Req() req) {
    const url = `${this.configService.get('AUTH_SERVICE_URL')}/auth/reset-password`;
    return this.proxy.forward('POST', url, body, req.headers);
  }
}
