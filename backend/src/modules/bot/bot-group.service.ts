import { Update as UpdateDecorator, Ctx, On, Next, Action } from 'nestjs-telegraf';
import { Scenes, Telegraf } from 'telegraf';
import { MarlboroLoggerService } from '../marlboro-logger/marlboro-logger.service';
import { ConfigService } from '@nestjs/config';
import { AccountRepository } from '../account/account.repository';
import { NextFunction } from 'express';
import { ActionCustomContext, CustomContextTypes } from './types/CustomContext.types';
import { BotJoinChatService } from './bot-join-chat.service';

type TelegrafContext = Scenes.SceneContext;

@UpdateDecorator()
export class BotGroupService extends Telegraf<TelegrafContext> {
    constructor(
        private readonly configService: ConfigService,
        private readonly logger: MarlboroLoggerService,
        private readonly accountRepository: AccountRepository,
        private readonly joinService: BotJoinChatService
    ) {
        super(configService.get('BOT_TOKEN'));
    }

    @On('text')
    async onJoinGroup(@Ctx() groupCtx: CustomContextTypes, @Next() next: NextFunction): Promise<void> {
        const loggerContext = `${BotGroupService.name}/${this.onJoinGroup.name}`;

        try {
            if (groupCtx.update.message.chat.type !== 'group') {
                next();
                return;
            }

            await this.joinService.joinChat(groupCtx, next);

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
