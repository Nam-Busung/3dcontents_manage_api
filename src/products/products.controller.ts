import {Body, Controller, Post, Request} from '@nestjs/common';
import {ProductsService} from './products.service';
import {CreateProductDto} from './dto/create-product.dto'

@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductsService) {
    }

    @Post()
    create(@Request() req, @Body() productData: CreateProductDto) {
        return this.productService.create(req, productData);
    }
}
