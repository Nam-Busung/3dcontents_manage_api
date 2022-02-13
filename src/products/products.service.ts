import {Body, HttpException, HttpStatus, Injectable, NotFoundException, Request} from '@nestjs/common';
import {CreateProductDto} from './dto/create-product.dto';
import {UpdateProductDto} from './dto/update-product.dto';

import {Product} from './entities/product.entity';
import {db} from "../main"

@Injectable()
export class ProductsService {
    getMarketList() {
        throw new Error('Method not implemented.');
    }


    //todo: 환율 갱신 cron 사용

    async create(@Request() req, @Body() productData: CreateProductDto) {

        if (req.body.user.authority === "artist") {
            //임시저장 User 삭제
            delete req.body.user;
            productData = req.body;

            let productCnt: number;
            try {
                productCnt = db.getData("/product/notPermitted").length + db.getData("/product/permitted").length;
            } catch {
                try {
                    productCnt = db.getData("/product/notPermitted").length
                } catch {
                    productCnt = 0;
                }
            }

            const object = {
                id: productCnt + 1,
                ...productData,
                fee: 0,
                permission: false
            } as Product;
            db.push("/product/notPermitted[]", object, true);

            return productData;
        } else {
            throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
        }
    }

    getNotPermitted(@Request() req) {
        if (req.body.user.authority === "editor") {
            let notpermitted: Product;
            try {
                notpermitted = db.getData("/product/notPermitted");
                return notpermitted;
            } catch {
                throw new NotFoundException(`products not found.`);
            }
        } else {
            throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
        }
    }

    getPermitted(@Request() req) {
        if (req.body.user.authority === "editor") {
            let permitted: Product;
            try {
                permitted = db.getData("/product/permitted");
                return permitted;
            } catch {
                throw new NotFoundException(`products not found.`);
            }
        } else {
            throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
        }
    }

    update(@Request() req, @Body() updateData: UpdateProductDto) {
        if (req.body.user.authority === "editor") {
            //임시저장 User 삭제
            delete req.body.user;
            updateData = req.body;

            if (db.getIndex("/product/notPermitted", updateData.id) !== -1) {
                const product = db.getData("/product/notPermitted[" + db.getIndex("/product/notPermitted", updateData.id) + "]");
                db.delete("/product/notPermitted[" + db.getIndex("/product/notPermitted", updateData.id) + "]");

                if (updateData.permission === false)
                    db.push("/product/notPermitted[]", {...product, ...updateData}, true);
                else
                    db.push("/product/permitted[]", {...product, ...updateData}, true);

                return 'updated';
            } else if (db.getIndex("/product/permitted", updateData.id) !== -1) {
                const product = db.getData("/product/permitted[" + db.getIndex("/product/permitted", updateData.id) + "]");
                db.delete("/product/permitted[" + db.getIndex("/product/permitted", updateData.id) + "]");

                if (updateData.permission === false)
                    db.push("/product/notPermitted[]", {...product, ...updateData}, true);
                else
                    db.push("/product/permitted[]", {...product, ...updateData}, true);

                return 'updated';
            } else {
                throw new NotFoundException(`products not found.`);

            }
        } else {
            throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
        }

    }
}
