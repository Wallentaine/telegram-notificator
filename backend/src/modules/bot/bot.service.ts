import { Start, Update as UpdateDecorator, Ctx, On, Message as MessageDecorator } from 'nestjs-telegraf';
import { Context, Scenes, Telegraf } from 'telegraf';
import { Message, Update } from 'typegram';
import MessageUpdate = Update.MessageUpdate;
import TextMessage = Message.TextMessage;
import { MarlboroLoggerService } from '../marlboro-logger/marlboro-logger.service';
import { ConfigService } from '@nestjs/config';
import { AccountRepository } from '../account/account.repository';

type TelegrafContext = Scenes.SceneContext;

@UpdateDecorator()
export class BotService extends Telegraf<TelegrafContext> {
    constructor(
        private readonly configService: ConfigService,
        private readonly logger: MarlboroLoggerService,
        private readonly accountRepository: AccountRepository
    ) {
        super(configService.get('TELEGRAM_API'));
    }

    @Start()
    async onStart(@Ctx() ctx: Context): Promise<void> {
        const loggerContext = `${BotService.name}/${this.onStart.name}`;

        try {
            if (!(ctx as Context<MessageUpdate<TextMessage>>)) {
                this.logger.error('Unforeseen error', loggerContext);
            }

            const refinedContext = ctx as Context<MessageUpdate<TextMessage>>;

            const messageText = refinedContext?.update?.message?.text;

            if (!messageText) {
                this.logger.error('Failed to receive a message from the user', loggerContext);
            }

            if (!messageText.startsWith('/start')) {
                this.logger.error('Failed to receive a message containing /start from the user', loggerContext);
            }

            const payLoad = Number(messageText.replace('/start', ''));

            if (!payLoad) {
                this.logger.error('Failed to receive a message containing payload from the user', loggerContext);
            }

            const appAccount = await this.accountRepository.getAccountById(payLoad);

            if (!appAccount) {
                this.logger.error('Account not found', loggerContext);

                await refinedContext.replyWithHTML(`Не удалось подключиться, возможно вы ещё не установили виджет`);

                return;
            }

            const telegramUserId = refinedContext.update.message.from.id;

            if (appAccount.telegramUsers?.find((telegramUser) => telegramUser.telegramId === telegramUserId)) {
                this.logger.error('Telegram user exist in account', loggerContext);

                await refinedContext.replyWithHTML(`Вы уже подключены к аккаунту ${appAccount.subdomain} amoCRM`);

                return;
            }

            const telegramUserName = refinedContext.update.message.from.last_name
                ? refinedContext.update.message.from.first_name + ' ' + refinedContext.update.message.from.last_name
                : refinedContext.update.message.from.first_name;

            appAccount.telegramUsers = [
                ...appAccount.telegramUsers,
                {
                    telegramId: telegramUserId,
                    telegramUserName: telegramUserName,
                },
            ];

            await this.accountRepository.updateAccountByID(appAccount);

            const botFirstName = refinedContext.botInfo.first_name ? refinedContext.botInfo.first_name : '';
            const botLastName = refinedContext.botInfo.last_name ? refinedContext.botInfo.last_name : '';

            const botName = botFirstName + botLastName;

            await ctx.replyWithHTML(
                `Привет ${telegramUserName}, я бот "${botName}" и я буду уведомлять тебя об изменениях в сделках, в соответствии с настройками в цифровой воронке вашего аккаунта. Ваш аккаунт amoCRM - ${appAccount.subdomain}`
            );

            this.logger.info(
                `User ${telegramUserName} with id - ${telegramUserId} successfully connected the bot to account ${appAccount.subdomain} with id - ${appAccount.id}`,
                loggerContext
            );

            return;
        } catch (error) {
            this.logger.error(error, loggerContext);
        }
    }

    @On('text')
    async onMessage(@MessageDecorator('text') message: string, @Ctx() ctx: Context) {
        await ctx.replyWithHTML('salam');
    }
}
