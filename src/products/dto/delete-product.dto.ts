import {IsBoolean, IsNumber, IsOptional} from 'class-validator';
import {PartialType} from '@nestjs/mapped-types';
import {CreateProductDto} from './create-product.dto';

export class DeleteProductDto {
    @IsNumber()
    readonly id: number;
}
