import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Param, Put } from '@nestjs/common/decorators';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {}
    @Post('register')
    register(@Body() user: UserDto) {
        return this.userService.register(user);
    }
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req) {
        return this.authService.login(req.user);
    }
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req) {
        return req.user;
    }
    @UseGuards(JwtAuthGuard)
    @Put('update')
    updateUser(@Req() req, @Body() user: User) {
        return this.userService.update(req.user.userId, user);
    }
    @Get(':usernameOrId')
    getUser(@Param('usernameOrId') usernameOrId: string) {
        return this.userService.getUser(usernameOrId);
    }
    @UseGuards(JwtAuthGuard)
    @Post('follow/:username')
    doFollow(@Req() req, @Param('username') username: string) {
        return this.userService.doFollow(req.user.username, username);
    }
    @UseGuards(JwtAuthGuard)
    @Post('unFollow/:username')
    doUnFollow(@Req() req, @Param('username') username: string) {
        return this.userService.doUnFollow(req.user.username, username);
    }
}
