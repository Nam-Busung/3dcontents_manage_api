import {ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import axios from 'axios';
import {JsonDB} from 'node-json-db';
import {Config} from 'node-json-db/dist/lib/JsonDBConfig';
import {AppModule} from './app.module';
import {User} from './user/entities/user.entity'

export const db = new JsonDB(new Config("ContentManageDB", true, false, '/'));


async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    //initial exchange rate
    axios.get('https://api.exchangeratesapi.io/v1/latest?access_key=4708af6aa231c77ba5382e47695281ed')
        .then(res => {
            db.push("/dollar", res.data.rates.USD / res.data.rates.KRW, true);
            db.push("/yuan", res.data.rates.CNY / res.data.rates.KRW, true);
        })
        .catch(err => {
            db.push("/dollar", 0.00083, true);
            db.push("/yuan", 0.0053, true);
        })

    //generate test users
    const artist = {
        id: 1,
        authority: "artist"
    } as User;
    const editor = {
        id: 2,
        authority: "editor"
    } as User;
    const client = {
        id: 3,
        authority: "client"
    } as User;

    db.push("/user[0]", artist, true);
    db.push("/user[1]", editor, true);
    db.push("/user[2]", client, true);

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
    }));
    await app.listen(3000);
}

bootstrap();
