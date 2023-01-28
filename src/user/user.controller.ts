import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Delete, Param, Put } from '@nestjs/common/decorators';
import { User } from './entities/user.entity';
import { ChangePasswordDto } from './dto/change.password.dto';

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
	@UseGuards(JwtAuthGuard)
	@Post('changePassword')
	changePassword(@Req() req, @Body() changePassword: ChangePasswordDto) {
		return this.userService.changePassword(req.user.userId, changePassword);
	}
	//admin
	@UseGuards(JwtAuthGuard)
	@Get('admin')
	getAllUsersByAdmin(@Req() req) {
		return this.userService.getAllUsersByAdmin(req.user);
	}
	@UseGuards(JwtAuthGuard)
	@Put('admin/:id')
	lockUser(@Req() req, @Param('id') id: string) {
		return this.userService.lockUser(req.user, id);
	}
	@UseGuards(JwtAuthGuard)
	@Delete('admin/:id')
	deleteUser(@Req() req, @Param('id') id: string) {
		return this.userService.deleteUser(req.user, id);
	}
	@UseGuards(JwtAuthGuard)
	@Post('admin/:id')
	makeAdmin(@Req() req, @Param('id') id: string) {
		return this.userService.makeAdmin(req.user, id);
	}
}
