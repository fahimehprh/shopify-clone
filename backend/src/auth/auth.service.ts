import { compare } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwtPayload';


@Injectable()
export class AuthService {
    constructor(private userService: UsersService, private jwtService: JwtService) {}

    async validateUser(userId: string, password: string) {
        const user = await this.userService.findOneWithPassword(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }
        const { password: _password, ...safeUser } = user;
        return safeUser;
    }

    login(userId: string) {
        const payload: AuthJwtPayload = { sub: userId };
        return this.jwtService.sign(payload);
    }
}
