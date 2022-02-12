import {IsBoolean, IsNumber} from 'class-validator';
import {PartialType} from '@nestjs/mapped-types';
import {CreateProductDto} from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsNumber()
    readonly fee?: number;

    @IsBoolean()
    readonly permission?: boolean;
}
