import { Update as UpdateDecorator, Ctx, Next } from 'nestjs-telegraf';
import { Markup, Scenes, Telegraf } from 'telegraf';
import { MarlboroLoggerService } from '../../core/marlboro-logger/marlboro-logger.service';
import { ConfigService } from '@nestjs/config';
import { AccountRepository } from '../account/account.repository';
import { ActionCustomContext, CustomChannelContext, CustomContextTypes } from './types/custom-context.types';
import { NextFunction } from 'express';
import { JoinChatInfoTypes } from './types/join-chat-info.types';

type TelegrafContext = Scenes.SceneContext;

@UpdateDecorator()
export class BotJoinChatService extends Telegraf<TelegrafContext> {
    constructor(
        private readonly configService: ConfigService,
        private readonly logger: MarlboroLoggerService,
        private readonly accountRepository: AccountRepository
    ) {
        super(configService.get('BOT_TOKEN'));
    }

    public async joinChat(@Ctx() ctx: CustomContextTypes | CustomChannelContext, @Next() next: NextFunction): Promise<void> {
        const loggerContext = `${BotJoinChatService.name}/${this.joinChat.name}`;

        try {
            const chatInfo: JoinChatInfoTypes = {
                userAdminId: null,
                username: null,
                firstName: null,
                lastName: null,
                chatId: null,
                chatTitle: null,
            };

            if ('message' in ctx.update) {
                if (ctx.update.message.chat.type !== 'group') {
                    next();
                    return;
                }

                chatInfo.userAdminId = ctx.update.message.from.id;
                chatInfo.username = ctx.update.message.from.username;
                chatInfo.firstName = ctx.update.message.from.first_name;
                chatInfo.lastName = ctx.update.message.from.last_name;

                chatInfo.chatId = ctx.update.message.chat.id;
                chatInfo.chatTitle = ctx.update.message.chat.title;
            }

            if ('channel_post' in ctx.update) {
                if (ctx.update.channel_post.chat.type !== 'channel') {
                    next();
                    return;
                }

                const channelAdmins = await ctx.getChatAdministrators();

                const channelAdmin = channelAdmins.find((administrator) => !administrator.user.is_bot && administrator.user.id);

                if (!channelAdmin) {
                    this.logger.error(`Administrator for this channel not found`, loggerContext);

                    await ctx.reply('Возможно у текущего канала нету администратора');

                    return;
                }

                chatInfo.userAdminId = channelAdmin.user.id;
                chatInfo.username = channelAdmin.user.username;
                chatInfo.firstName = channelAdmin.user.first_name;
                chatInfo.lastName = channelAdmin.user.last_name;

                chatInfo.chatId = ctx.update.channel_post.chat.id;
                chatInfo.chatTitle = ctx.update.channel_post.chat.title;
            }

            const appAccountsWithCurrentUser = await this.accountRepository.getAccountsByTelegramUserId(chatInfo.userAdminId);

            if (!appAccountsWithCurrentUser?.length) {
                this.logger.error(
                    `User ${chatInfo.username} with id - ${chatInfo.userAdminId} did not connect the account to amoCRM`,
                    loggerContext
                );

                await ctx.reply(
                    'Возможны вы не подключили аккаунт amoCRM к telegram боту, для этого, перейдите по ссылке подключения в настройках виджета'
                );

                return;
            }

            const botFirstName = ctx.botInfo.first_name ? ctx.botInfo.first_name : '';
            const botLastName = ctx.botInfo.last_name ? ctx.botInfo.last_name : '';

            const botName = botFirstName + botLastName;
            const userName = chatInfo.firstName + ' ' + (chatInfo.lastName || '') || chatInfo.username || '';

            if (appAccountsWithCurrentUser.length > 1) {
                await ctx.reply(
                    `Привет ${userName}, я бот "${botName}", так как я помогаю тебе на нескольких аккаунтах AmoCRM, выбери аккаунт к которому будет привязан этот чат`,
                    {
                        parse_mode: 'HTML',
                        ...Markup.inlineKeyboard([
                            appAccountsWithCurrentUser.map((account) => {
                                return Markup.button.callback(account.subdomain, `select-acc-${account.id}`);
                            }),
                        ]),
                    }
                );

                return;
            }

            const [appAccount] = appAccountsWithCurrentUser;

            appAccount.telegramUsers.push({
                telegramId: chatInfo.chatId,
                telegramUserName: chatInfo.chatTitle,
                amoUserId: null,
                amoUserName: null,
            });

            await this.accountRepository.updateAccountByID(appAccount);

            await ctx.reply(
                `Привет ${userName}, я бот "${botName}", успешно добавил этот чат к вам в аккаунт AmoCRM, и я буду уведомлять вас об изменениях в сделках, в соответствии с настройками в цифровой воронке вашего аккаунта.`
            );

            this.logger.info(
                `Group ${chatInfo.chatTitle} with id - ${chatInfo.chatId} has been added to account ${appAccount.subdomain} with id - ${appAccount.id}`,
                loggerContext
            );

            return;
        } catch (error) {
            this.logger.error(error, loggerContext);
        }
    }

    public async handleDynamicAction(@Ctx() selectAccountCtx: ActionCustomContext, @Next() next: NextFunction) {
        const loggerContext = `${BotJoinChatService.name}/${this.handleDynamicAction.name}`;

        try {
            const chatType = selectAccountCtx.update.callback_query.message.chat.type;

            switch (chatType) {
                case 'channel': {
                    break;
                }
                case 'group': {
                    break;
                }
                default: {
                    next();
                    return;
                }
            }

            const [payload] = selectAccountCtx.match;

            const accountId = Number(payload.replace('select-acc-', ''));

            const account = await this.accountRepository.getAccountById(accountId);

            const responseText = 'Вы выбрали аккаунт ' + account.subdomain;

            const {
                message: {
                    message_id: messageId,
                    chat: { id: groupId, title: groupTitle },
                },
            } = selectAccountCtx.update.callback_query;

            await selectAccountCtx.answerCbQuery(responseText);
            await selectAccountCtx.reply(responseText);
            await selectAccountCtx.deleteMessage(messageId);

            account.telegramUsers.push({
                telegramId: groupId,
                telegramUserName: groupTitle,
                amoUserId: null,
                amoUserName: null,
            });

            await this.accountRepository.updateAccountByID(account);

            this.logger.info(
                `Group ${groupTitle} with id - ${groupId} has been added to account ${account.subdomain} with id - ${account.id}`,
                loggerContext
            );
        } catch (error) {
            this.logger.error(error, loggerContext);
        }
    }
}
