import {Body, HttpException, HttpStatus, Injectable, NotFoundException, Request} from '@nestjs/common';
import {CreateProductDto} from './dto/create-product.dto';
import {UpdateProductDto} from './dto/update-product.dto';
import {ListProductDto} from './dto/list-product.dto';
import {DeleteProductDto} from './dto/delete-product.dto';

import {Product} from './entities/product.entity';
import {db} from "../config"
import {Cron} from '@nestjs/schedule';
import axios from "axios";

@Injectable()
export class ProductsService {


    //환율 갱신 cron
    @Cron('0 0 * * *')
    async getExchangeRate() {
        await axios.get('http://api.exchangeratesapi.io/v1/latest?access_key=4708af6aa231c77ba5382e47695281ed')
            .then(res => {
                db.push("/dollar", res.data.rates.USD / res.data.rates.KRW, true);
                db.push("/yuan", res.data.rates.CNY / res.data.rates.KRW, true);
            })
            .catch(err => {
                db.push("/dollar", 0.00083, true);
                db.push("/yuan", 0.0053, true);
            })
        return 'succeed'
    }

    async create(@Request() req, @Body() productData: CreateProductDto) {
        if (req.forwardingUser.authority === "artist") {

            let productCnt: number;
            try {
                productCnt = db.getData("/product/notPermitted").length + db.getData("/product/permitted").length + db.getData("/product/deleted").length;
            } catch {
                try {
                    productCnt = db.getData("/product/notPermitted").length + db.getData("/product/permitted").length;
                } catch {
                    try {
                        productCnt = db.getData("/product/notPermitted").length
                    } catch {
                        productCnt = 0;
                    }
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
        if (req.forwardingUser.authority === "editor") {
            try {
                const notpermitted: Product = db.getData("/product/notPermitted");
                return notpermitted;
            } catch {
                throw new NotFoundException(`products not found.`);
            }
        } else {
            throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
        }
    }

    getPermitted(@Request() req) {
        if (req.forwardingUser.authority === "editor") {
            try {
                const permitted: Product = db.getData("/product/permitted");
                return permitted;
            } catch {
                throw new NotFoundException(`products not found.`);
            }
        } else {
            throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
        }
    }

    getMarketList() {
        try {
            const product = JSON.parse(JSON.stringify(db.getData("/product/permitted")));
            const dollor = db.getData("/dollar");
            const yuan = db.getData("/yuan");
            const marketlist: ListProductDto[] = product.map(element => {
                let marketproduct = element
                marketproduct.price = [element.price, element.price * dollor, element.price * yuan];
                marketproduct.fee = [element.fee, element.fee * dollor, element.fee * yuan];

                const {title, description, price, fee} = marketproduct;
                return {title, description, price, fee};
            });
            return marketlist;
        } catch {
            throw new NotFoundException(`products not found.`);
        }
    }

    update(@Request() req, @Body() updateData: UpdateProductDto) {
        if (req.forwardingUser.authority === "editor") {
            try {
                if (db.getIndex("/product/notPermitted", updateData.id) !== -1) {
                    const product = db.getData("/product/notPermitted[" + db.getIndex("/product/notPermitted", updateData.id) + "]");
                    db.delete("/product/notPermitted[" + db.getIndex("/product/notPermitted", updateData.id) + "]");

                    if (updateData.permission === false)
                        db.push("/product/notPermitted[]", {...product, ...updateData}, true);
                    else
                        db.push("/product/permitted[]", {...product, ...updateData}, true);

                    return 'updated';
                } else {
                    throw new NotFoundException(`products not found.`);
                }
            } catch {
                try {
                    if (db.getIndex("/product/permitted", updateData.id) !== -1) {
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
                } catch {
                    throw new NotFoundException(`products not found.`);
                }
            }
        } else {
            throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
        }

    }

    delete(@Request() req, @Body() deleteData: DeleteProductDto) {
        if (req.forwardingUser.authority === "editor") {
            try {
                if (db.getIndex("/product/notPermitted", deleteData.id) !== -1) {
                    const product = db.getData("/product/notPermitted[" + db.getIndex("/product/notPermitted", deleteData.id) + "]");
                    db.delete("/product/notPermitted[" + db.getIndex("/product/notPermitted", deleteData.id) + "]");
                    db.push("/product/deleted[]", {...product}, true);

                    return 'deleted';
                } else {
                    throw new NotFoundException(`products not found.`);
                }
            } catch {
                try {
                    if (db.getIndex("/product/permitted", deleteData.id) !== -1) {
                        const product = db.getData("/product/permitted[" + db.getIndex("/product/permitted", deleteData.id) + "]");
                        db.delete("/product/permitted[" + db.getIndex("/product/permitted", deleteData.id) + "]");
                        db.push("/product/deleted[]", {...product}, true);

                        return 'deleted';
                    } else {
                        throw new NotFoundException(`products not found.`);
                    }
                } catch {
                    throw new NotFoundException(`products not found.`);
                }
            }
        } else {
            throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
        }

    }
}
