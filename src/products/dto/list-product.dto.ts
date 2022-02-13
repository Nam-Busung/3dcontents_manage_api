import {IsNumber, IsString} from "class-validator";

export class ListProductDto {
    @IsString({each: true})
    readonly title: string[];

    @IsString({each: true})
    readonly description: string[];

    @IsNumber({}, {each: true})
    readonly price: number[];

    @IsNumber({}, {each: true})
    readonly fee: number[];
}
