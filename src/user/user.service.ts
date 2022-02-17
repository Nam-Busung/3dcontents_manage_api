import {Body, Injectable, NotFoundException, Response} from '@nestjs/common';
import {db} from "../config"
import {User} from './entities/user.entity'
import * as jwt from 'jsonwebtoken';
import {LoginUserDto} from './dto/login-user.dto';
import {SECRET} from '../config';

@Injectable()
export class UserService {
    async signup(){
        const artist = {
            id: 1,
            authority: "artist"
        } as User;
        const editor = {
            id: 2,
            authority: "editor"
        } as User;
        const client = {
            id: 3,
            authority: "client"
        } as User;

        db.push("/user[0]", artist, true);
        db.push("/user[1]", editor, true);
        db.push("/user[2]", client, true);

        return 'signup succeed'
    }

    async login(@Response() res, @Body() loginData: LoginUserDto){
        let user: User;
        if (db.getIndex("/user", loginData.id) !== -1)
            user = this.findUser(loginData.id);
        else
            throw new NotFoundException(`User with ID ${loginData.id} not found.`);

        const token = await jwt.sign({
            ...user, exp: Math.floor(Date.now() / 1000) + (60 * 60),
        }, SECRET);
        await res.cookie('accessToken', token);
        res.locals.user = user;
        return res.send(user)
    }

    findUser(userId: number) {
        let user: User;

        if (db.getIndex("/user", userId) !== -1)
            user = db.getObject<User>("/user[" + db.getIndex("/user", userId) + "]");
        else
            throw new NotFoundException(`User with ID ${userId} not found.`);

        return user;
    }
}
