import {Update as UpdateDecorator, Ctx, On, Next} from 'nestjs-telegraf';
import {NarrowedContext, Scenes, Telegraf} from 'telegraf';
import { Message, Update } from 'typegram';
import { MarlboroLoggerService } from '../marlboro-logger/marlboro-logger.service';
import { ConfigService } from '@nestjs/config';
import { AccountRepository } from '../account/account.repository';
import {NextFunction} from "express";

type TelegrafContext = Scenes.SceneContext;

@UpdateDecorator()
export class BotTextService extends Telegraf<TelegrafContext> {
    constructor(
        private readonly configService: ConfigService,
        private readonly logger: MarlboroLoggerService,
        private readonly accountRepository: AccountRepository
    ) {
        super(configService.get('BOT_TOKEN'));
    }


    @On('text')
    async onText(@Ctx() textCtx:  NarrowedContext<Scenes.WizardContext<Scenes.WizardSessionData>, {message: Update.New & Update.NonChannel & Message.MigrateToChatIdMessage, update_id: number}>, @Next() next: NextFunction): Promise<void> {
        const loggerContext = `${BotTextService.name}/${this.onText.name}`;

        try {
            console.log('salam');
        } catch (error) {
            this.logger.error(error, loggerContext);
        }
    }
}
