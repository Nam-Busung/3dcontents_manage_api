import {Body, Controller, Get, Post, Request} from '@nestjs/common';
import {ProductsService} from './products.service';
import {CreateProductDto} from './dto/create-product.dto'

@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductsService) {
    }

    //product 생성(artist)
    @Post()
    create(@Request() req, @Body() productData: CreateProductDto) {
        return this.productService.create(req, productData);
    }

    //permission false 조회(editor)
    @Get('/notpermitted')
    getNotPermitted(@Request() req) {
        return this.productService.getNotPermitted(req);
    }

    //todo: permission true 조회(모든 권한 가능)
    @Get()
    getPermitted() {
        return this.productService.getPermitted();
    }

    //todo: update(editor)



}
