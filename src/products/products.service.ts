import {Injectable} from '@nestjs/common';
import {CreateProductDto} from './dto/create-product.dto';
import {Product} from './entities/product.entity';
import {JsonDB} from "node-json-db";
import {Config} from "node-json-db/dist/lib/JsonDBConfig";
import {db} from "../main"

@Injectable()
export class ProductsService {
    create(productData: CreateProductDto) {
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
    }
}
