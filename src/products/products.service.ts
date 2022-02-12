import {Body, HttpException, HttpStatus, Injectable, Request} from '@nestjs/common';
import {CreateProductDto} from './dto/create-product.dto';
import {Product} from './entities/product.entity';
import {db} from "../main"

@Injectable()
export class ProductsService {
    create(@Request() req, @Body() productData: CreateProductDto) {

        if (req.body.user.authority === "artist") {
            let productCnt: number;
            try {
                productCnt = db.getData("/product").length;
            } catch {
                productCnt = 0;
            }
            const object = {
                id: productCnt + 1,
                ...productData,
                fee: 0,
                permission: false
            } as Product;

            db.push("/product[]", object, true);

            return req.body
        } else {
            throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
        }


    }
}
