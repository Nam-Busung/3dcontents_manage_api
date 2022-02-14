import {HttpException} from '@nestjs/common/exceptions/http.exception';
import {HttpStatus, Injectable, NestMiddleware} from '@nestjs/common';
import {NextFunction, Request, Response} from 'express';
import * as jwt from 'jsonwebtoken';
import {SECRET} from '../config';
import {User} from './entities/user.entity'
import {UserService} from './user.service';

interface RequestModel extends Request {
    forwardingUser: User
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly userService: UserService) {
    }

    async use(req: RequestModel, res: Response, next: NextFunction) {

        try {
            const token = req.headers.authorization;
            const decoded: any = jwt.verify(token, SECRET);
            const user = await this.userService.findUser(decoded.id);
            if (!user) {
                throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
            }
            req.forwardingUser = user;
            next();
        } catch (error) {
            throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
        }
    }
}
