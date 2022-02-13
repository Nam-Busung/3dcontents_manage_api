import {Body, HttpException, HttpStatus, Injectable, NotFoundException, Request} from '@nestjs/common';
import {CreateProductDto} from './dto/create-product.dto';
import {Product} from './entities/product.entity';
import {db} from "../main"

@Injectable()
export class ProductsService {

    //환율 갱신 cron 사용

    create(@Request() req, @Body() productData: CreateProductDto) {

        if (req.body.user.authority === "artist") {
            let productCnt: number;
            try {
                productCnt = db.getData("/product/notPermitted").length;
            } catch {
                productCnt = 0;
            }

            const {title, description, price} = productData;
            const productData_ = {title, description, price};
            const object = {
                id: productCnt + 1,
                ...productData_,
                fee: 0,
                permission: false
            } as Product;

            db.push("/product/notPermitted[]", object, true);

            return productData_;
        } else {
            throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
        }
    }

    getNotPermitted(@Request() req) {
        if (req.body.user.authority === "editor") {
            let ListProductDto: Product;
            try {
                ListProductDto = db.getData("/product/notPermitted");
                return ListProductDto;
            } catch {
                throw new NotFoundException(`products not found.`);
            }
        } else {
            throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
        }
    }

    getPermitted() {
        throw new Error('Method not implemented.');
    }
}
