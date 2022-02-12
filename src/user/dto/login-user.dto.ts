import { IsNotEmpty, IsNumber } from 'class-validator';

export class LoginUserDto {
    @IsNotEmpty()
    @IsNumber()
    readonly id: number;
}
