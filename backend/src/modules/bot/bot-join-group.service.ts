import { Update as UpdateDecorator, Ctx, On, Next, Action } from 'nestjs-telegraf';
import { Markup, Scenes, Telegraf } from 'telegraf';
import { MarlboroLoggerService } from '../marlboro-logger/marlboro-logger.service';
import { ConfigService } from '@nestjs/config';
import { AccountRepository } from '../account/account.repository';
import { NextFunction } from 'express';
import { ActionCustomContext, CustomContext } from './types/CustomContext';

type TelegrafContext = Scenes.SceneContext;

@UpdateDecorator()
export class BotJoinGroupService extends Telegraf<TelegrafContext> {
    constructor(
        private readonly configService: ConfigService,
        private readonly logger: MarlboroLoggerService,
        private readonly accountRepository: AccountRepository
    ) {
        super(configService.get('BOT_TOKEN'));
    }

    @On('text')
    async onJoinGroup(@Ctx() groupCtx: CustomContext, @Next() next: NextFunction): Promise<void> {
        const loggerContext = `${BotJoinGroupService.name}/${this.onJoinGroup.name}`;

        try {
            if (groupCtx.update.message.chat.type !== 'group') {
                next();
                return;
            }

            const {
                from: { id: userAdminId, username, first_name: firstName, last_name: lastName },
                chat: { id: groupId, title: groupTitle },
            } = groupCtx.update.message;

            if (await this.accountRepository.getAccountByTelegramUserId(groupId)) {
                this.logger.error(`The group ${groupTitle} with id - ${groupId} is already connected to the account`, loggerContext);
                return;
            }

            if (!userAdminId) {
                this.logger.error(`User ${username} with id - ${userAdminId} not admin`, loggerContext);
                return;
            }

            const appAccountsWithCurrentUser = await this.accountRepository.getAccountsByTelegramUserId(userAdminId);

            if (!appAccountsWithCurrentUser?.length) {
                this.logger.error(`User ${username} with id - ${userAdminId} did not connect the account to amoCRM`, loggerContext);

                await groupCtx.reply(
                    'Возможны вы не подключили аккаунт amoCRM к telegram боту, для этого, перейдите по ссылке подключения в настройках виджета'
                );

                return;
            }

            const botFirstName = groupCtx.botInfo.first_name ? groupCtx.botInfo.first_name : '';
            const botLastName = groupCtx.botInfo.last_name ? groupCtx.botInfo.last_name : '';

            const botName = botFirstName + botLastName;
            const userName = firstName ? firstName + ' ' + (lastName ? lastName : '') : username ? username : '';

            if (appAccountsWithCurrentUser.length > 1) {
                await groupCtx.sendMessage(
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
                telegramId: groupId,
                telegramUserName: groupTitle,
            });

            await this.accountRepository.updateAccountByID(appAccount);

            await groupCtx.reply(
                `Привет ${userName}, я бот "${botName}", успешно добавил этот чат к вам в аккаунт AmoCRM, и я буду уведомлять вас об изменениях в сделках, в соответствии с настройками в цифровой воронке вашего аккаунта.`
            );

            this.logger.info(
                `Group ${groupTitle} with id - ${groupId} has been added to account ${appAccount.subdomain} with id - ${appAccount.id}`,
                loggerContext
            );

            return;
        } catch (error) {
            this.logger.error(error, loggerContext);
        }
    }

    @Action(/select-acc-.+/gm)
    private async handleDynamicAction(@Ctx() selectAccountCtx: ActionCustomContext, @Next() next: NextFunction) {
        const loggerContext = `${BotJoinGroupService.name}/${this.handleDynamicAction.name}`;

        try {
            if (selectAccountCtx.update.callback_query.message.chat.type !== 'group') {
                next();
                return;
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
