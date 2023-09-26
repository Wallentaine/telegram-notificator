import { Update as UpdateDecorator, Ctx, On } from 'nestjs-telegraf';
import { NarrowedContext, Scenes, Telegraf } from 'telegraf';
import { Message, Update } from 'typegram';
import { MarlboroLoggerService } from '../marlboro-logger/marlboro-logger.service';
import { ConfigService } from '@nestjs/config';
import { AccountRepository } from '../account/account.repository';
import { CustomContext } from './types/CustomContext';

type TelegrafContext = Scenes.SceneContext;

@UpdateDecorator()
export class BotChatMigrateService extends Telegraf<TelegrafContext> {
    constructor(
        private readonly configService: ConfigService,
        private readonly logger: MarlboroLoggerService,
        private readonly accountRepository: AccountRepository
    ) {
        super(configService.get('BOT_TOKEN'));
    }

    @On('migrate_to_chat_id')
    async onMigrate(@Ctx() migrateCtx: CustomContext): Promise<void> {
        const loggerContext = `${BotChatMigrateService.name}/${this.onMigrate.name}`;

        try {
            const oldChatId = migrateCtx.update.message.chat.id;
            const newChatId = migrateCtx.update.message.migrate_to_chat_id;

            await this.accountRepository.migrateChat(oldChatId, newChatId);

            this.logger.info(`Chat successful migrate from ${oldChatId} to ${newChatId}`, loggerContext);
        } catch (error) {
            this.logger.error(error, loggerContext);
        }
    }
}
