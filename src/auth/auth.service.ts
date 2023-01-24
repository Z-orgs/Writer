import { Injectable, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.userService.findOneBy({ username: username });

        if (!user) {
            return null;
        }
        const isEqual = compareSync(pass, user.password);

        if (!isEqual) {
            return null;
        }
        const { password, ...result } = user;
        return result;
    }
    async login(user: User) {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
