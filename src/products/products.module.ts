import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {ProductsController} from './products.controller'
import {ProductsService} from './products.service'
import {AuthMiddleware} from "../user/auth.middleware";
import {UserModule} from '../user/user.module'

@Module({
    imports: [UserModule],
    controllers: [ProductsController],
    providers: [ProductsService]
})
export class ProductsModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes(
                {path: 'products', method: RequestMethod.POST},
                {path: 'products/notpermitted', method: RequestMethod.GET},
                {path: 'products/update', method: RequestMethod.PATCH}
            );
    }
}

