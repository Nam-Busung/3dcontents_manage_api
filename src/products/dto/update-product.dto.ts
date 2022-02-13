import {IsBoolean, IsNumber, IsOptional} from 'class-validator';
import {PartialType} from '@nestjs/mapped-types';
import {CreateProductDto} from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsNumber()
    readonly id: number;

    @IsNumber({}, {each: true})
    @IsOptional()
    readonly fee: number[];

    @IsBoolean()
    @IsOptional()
    readonly permission: boolean;

}
