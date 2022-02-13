import {Body, Controller, Get, Patch, Post, Request} from '@nestjs/common';
import {ProductsService} from './products.service';
import {CreateProductDto} from './dto/create-product.dto'
import {UpdateProductDto} from './dto/update-product.dto';

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

    //permission true 조회(editor)
    @Get('/permitted')
    getPermitted(@Request() req) {
        return this.productService.getPermitted(req);
    }

    //permission true 조회(모든권한)
    @Get('/marketlist')
    getMarketList() {
        return this.productService.getMarketList();
    }

    //update(editor)
    @Patch('/update')
    patch(@Request() req, @Body() productData: UpdateProductDto) {
        return this.productService.update(req, productData);
    }


}
