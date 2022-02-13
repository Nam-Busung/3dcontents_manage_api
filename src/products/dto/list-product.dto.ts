import {IsBoolean, IsNumber, IsOptional, IsString} from "class-validator";

export class ListProductDto {
    @IsString({each: true})
    readonly title: string[];

    @IsString({each: true})
    readonly description: string[];

    @IsNumber()
    readonly price: number;

    @IsNumber()
    readonly fee: number;
}
