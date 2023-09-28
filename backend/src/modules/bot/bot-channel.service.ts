import { Update as UpdateDecorator, Ctx, On, Next, Action } from 'nestjs-telegraf';
import { Scenes, Telegraf } from 'telegraf';
import { MarlboroLoggerService } from '../marlboro-logger/marlboro-logger.service';
import { ConfigService } from '@nestjs/config';
import { AccountRepository } from '../account/account.repository';
import { ActionCustomContext, CustomChannelContext } from './types/CustomContext.types';
import { NextFunction } from 'express';
import { BotJoinChatService } from './bot-join-chat.service';

type TelegrafContext = Scenes.SceneContext;

@UpdateDecorator()
export class BotChannelService extends Telegraf<TelegrafContext> {
    constructor(
        private readonly configService: ConfigService,
        private readonly logger: MarlboroLoggerService,
        private readonly accountRepository: AccountRepository,
        private readonly joinService: BotJoinChatService
    ) {
        super(configService.get('BOT_TOKEN'));
    }

    @On('channel_post')
    async joinChannel(@Ctx() channelCtx: CustomChannelContext, @Next() next: NextFunction): Promise<void> {
        const loggerContext = `${BotChannelService.name}/${this.joinChannel.name}`;

        try {
            if (channelCtx.update.channel_post.chat.type !== 'channel') {
                next();
                return;
            }

            await this.joinService.joinChat(channelCtx, next);

            return;
        } catch (error) {
            this.logger.error(error, loggerContext);
        }
    }

    @Action(/select-acc-.+/gm)
    private async handleDynamicAction(@Ctx() selectAccountCtx: ActionCustomContext, @Next() next: NextFunction) {
        await this.joinService.handleDynamicAction(selectAccountCtx, next);
    }
}
