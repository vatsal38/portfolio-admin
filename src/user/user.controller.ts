import { LocalAuthGuard } from './../auth/local-auth.guard';
import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('Auth and User')
@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Sign up a new user' })
  async signup(@Body() createUserDto: CreateUserDto) {
    const { username, password, email, firstName, lastName } = createUserDto;
    await this.userService.createUser(
      username,
      email,
      firstName,
      lastName,
      password,
    );
    return { message: 'User created successfully' };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Log in user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  async login(@Body() data: any) {
    return await this.userService.login(data);
  }
}
