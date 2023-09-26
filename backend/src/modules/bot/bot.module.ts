import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { options } from './bot.config';
import { MarlboroLoggerService } from '../marlboro-logger/marlboro-logger.service';
import { AccountModule } from '../account/account.module';
import { AccountRepository } from '../account/account.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from '../account/account.model';
import { BotStartService } from './bot-start.service';
import { BotJoinGroupService } from './bot-join-group.service';
import { BotChatMigrateService } from './bot-chat-migrate.service';
import { BotTextService } from './bot-text.service';

@Module({
    imports: [
        TelegrafModule.forRootAsync(options()),
        MongooseModule.forFeature([
            {
                name: Account.name,
                schema: AccountSchema,
            },
        ]),
        AccountModule,
    ],
    providers: [BotStartService, BotJoinGroupService, BotTextService, BotChatMigrateService, MarlboroLoggerService, AccountRepository],
})
export class BotModule {}
