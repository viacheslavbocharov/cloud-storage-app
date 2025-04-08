import { Controller, Get, Patch, Delete, Body, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FetchProxyService } from 'src/common/proxy/fetch-proxy.service';


@Controller('users')
export class UsersController {
  constructor(
    private readonly configService: ConfigService,
    private readonly proxy: FetchProxyService,
  ) {}

  @Get('me') //+
  async getUser(@Req() req) {
    const url = `${this.configService.get('USER_SERVICE_URL')}/user`;
    return this.proxy.forward('GET', url, null, req.headers);
  }

  @Patch() //+
  async updateUser(@Body() body, @Req() req) {
    const url = `${this.configService.get('USER_SERVICE_URL')}/user`;
    return this.proxy.forward('PATCH', url, body, req.headers);
  }

  @Delete() //+
  async deleteUser(@Req() req) {
    const url = `${this.configService.get('USER_SERVICE_URL')}/user`;
    return this.proxy.forward('DELETE', url, null, req.headers);
  }
}
