import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {ProductsModule} from './products/products.module';
import {UserModule} from './user/user.module';

@Module({
    imports: [ProductsModule, UserModule],
    controllers: [AppController],
    providers: [],
})
export class AppModule {
}
