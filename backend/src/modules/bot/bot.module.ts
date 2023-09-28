import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { options } from './bot.config';
import { MarlboroLoggerService } from '../marlboro-logger/marlboro-logger.service';
import { AccountModule } from '../account/account.module';
import { AccountRepository } from '../account/account.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from '../account/account.model';
import { BotStartService } from './bot-start.service';
import { BotGroupService } from './bot-group.service';
import { BotChatMigrateService } from './bot-chat-migrate.service';
import { BotTextService } from './bot-text.service';
import { BotChannelService } from './bot-channel.service';
import { BotJoinChatService } from './bot-join-chat.service';

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
    providers: [
        BotStartService,
        BotJoinChatService,
        BotGroupService,
        BotChannelService,
        BotTextService,
        BotChatMigrateService,
        MarlboroLoggerService,
        AccountRepository,
    ],
})
export class BotModule {}
