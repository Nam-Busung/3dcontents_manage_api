import {ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {JsonDB} from 'node-json-db';
import {Config} from 'node-json-db/dist/lib/JsonDBConfig';
import {AppModule} from './app.module';
import {User} from './user/entities/user.entity'

export const db = new JsonDB(new Config("ContentManageDB", true, false, '/'));


async function bootstrap() {
    const app = await NestFactory.create(AppModule);

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
