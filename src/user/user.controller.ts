import {Body, Controller, Post, Response} from '@nestjs/common';
import {LoginUserDto} from './dto/login-user.dto';
import {UserService} from './user.service'

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Post('/login')
    login(@Response() res, @Body() loginData: LoginUserDto) {
        return this.userService.login(res, loginData);
    }
}
