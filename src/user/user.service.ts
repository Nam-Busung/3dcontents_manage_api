import {Body, Injectable, NotFoundException, Response} from '@nestjs/common';
import {db} from "../config"
import {User} from './entities/user.entity'
import * as jwt from 'jsonwebtoken';
import {LoginUserDto} from './dto/login-user.dto';
import {SECRET} from '../config';

@Injectable()
export class UserService {
    async login(@Response() res, @Body() loginData: LoginUserDto) {
        let user: User;
        if (db.getIndex("/user", loginData.id) !== -1)
            user = this.findUser(loginData.id);
        else
            throw new NotFoundException(`User with ID ${loginData.id} not found.`);

        const token = await jwt.sign({
            ...user, exp: Math.floor(Date.now() / 1000) + (60 * 60),
        }, SECRET);
        await res.cookie('accessToken', token);
        return res.send(user);
    }

    findUser(userId: number) {
        const user = db.getObject<User>("/user[" + db.getIndex("/user", userId) + "]");

        return user;
    }
}
