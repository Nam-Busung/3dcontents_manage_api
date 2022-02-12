import {HttpException} from '@nestjs/common/exceptions/http.exception';
import {HttpStatus, Injectable, NestMiddleware} from '@nestjs/common';
import {NextFunction, Request, Response} from 'express';
import * as jwt from 'jsonwebtoken';
import {SECRET} from '../config';
import {UserService} from './user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly userService: UserService) {
    }

    async use(req: Request, res: Response, next: NextFunction) {

        try {
            const token = req.headers.authorization;
            const decoded: any = jwt.verify(token, SECRET);
            const user = await this.userService.findUser(decoded.id);
            if (!user) {
                throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
            }
            req.body.user = user;
            next();
        } catch (error) {
            throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
        }
    }
}
