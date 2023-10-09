import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { BotModule } from '../modules/bot/bot.module';
import { AccountModule } from '../modules/account/account.module';
import { MarlboroLoggerService } from '../core/marlboro-logger/marlboro-logger.service';
import { AmoApiModule } from '../modules/amo-api/amo-api.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.${process.env.NODE_ENV}.env`,
            validationSchema: Joi.object({
                PORT: Joi.number().required(),
                MONGO_CONNECT: Joi.string().required(),
                MONGO_NAME: Joi.string().required(),
                CLIENT_ID: Joi.string().required(),
                CLIENT_SECRET: Joi.string().required(),
                REDIRECT_URI: Joi.string().required(),
                BOT_TOKEN: Joi.string().required(),
            }),
        }),
        MongooseModule.forRoot(process.env.MONGO_CONNECT, {
            dbName: process.env.MONGO_NAME,
        }),
        ScheduleModule.forRoot(),
        BotModule,
        AccountModule,
        AmoApiModule,
    ],
    controllers: [AppController],
    providers: [AppService, MarlboroLoggerService],
    exports: [MarlboroLoggerService],
})
export class AppModule {}
