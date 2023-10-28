import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { options } from './bot.config';
import { MarlboroLoggerService } from '../../core/marlboro-logger/marlboro-logger.service';
import { AccountModule } from '../account/account.module';
import { AccountRepository } from '../account/account.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from '../account/account.model';
import { BotStartService } from './bot-interactions-services/bot-start.service';
import { BotGroupService } from './bot-interactions-services/bot-group.service';
import { BotChatMigrateService } from './bot-interactions-services/bot-chat-migrate.service';
import { BotTextService } from './bot-interactions-services/bot-text.service';
import { BotChannelService } from './bot-interactions-services/bot-channel.service';
import { BotJoinChatService } from './bot-interactions-services/bot-join-chat.service';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { AmoApiService } from '../amo-api/amo-api.service';
import { AmoApiModule } from '../amo-api/amo-api.module';
import { BotNotifyService } from './bot-interactions-services/bot-notify.service';
import { BotSubscriberMessageRepository } from './bot.subscriber-message.repository';
import { BotSubscriberMessage, BotSubscriberMessageSchema } from './bot.subscriber-message.model';
import { BotUnsortedActionsService } from './bot-interactions-services/bot-unsorted-actions.service';
import { FillFieldWizardScene } from './scenes/wizard/fill-field/fill-field.wizard-scene';
import { BotFillFieldActionService } from './bot-interactions-services/bot-fill-field-actions.service';
import { SwapStageWizardScene } from './scenes/wizard/swap-stage/swap-stage.wizard-scene';
import { BotSwapStageActionsService } from './bot-interactions-services/bot-swap-stage-actions.service';

@Module({
    imports: [
        TelegrafModule.forRootAsync(options()),
        MongooseModule.forFeature([
            {
                name: Account.name,
                schema: AccountSchema,
            },
            {
                name: BotSubscriberMessage.name,
                schema: BotSubscriberMessageSchema,
            },
        ]),
        AccountModule,
        AmoApiModule,
    ],
    providers: [
        BotStartService,
        BotJoinChatService,
        BotGroupService,
        BotChannelService,
        BotTextService,
        BotNotifyService,
        BotChatMigrateService,
        BotUnsortedActionsService,
        BotFillFieldActionService,
        BotSwapStageActionsService,
        FillFieldWizardScene,
        SwapStageWizardScene,
        MarlboroLoggerService,
        AccountRepository,
        BotSubscriberMessageRepository,
        BotService,
        AmoApiService,
    ],
    controllers: [BotController],
})
export class BotModule {}
