import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {ProductsModule} from './products/products.module';
import {UserModule} from './user/user.module';
import {ScheduleModule} from '@nestjs/schedule';

@Module({
    imports: [
        ProductsModule,
        UserModule,
        ScheduleModule.forRoot()
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {
}
