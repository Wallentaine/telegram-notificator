import { Update as UpdateDecorator, Ctx, Action } from 'nestjs-telegraf';
import { Markup, Scenes, Telegraf } from 'telegraf';
import { MarlboroLoggerService } from '../../../core/marlboro-logger/marlboro-logger.service';
import { ConfigService } from '@nestjs/config';
import { ActionCustomContext } from '../types/custom-context.types';
import { BotSubscriberMessageRepository } from '../bot.subscriber-message.repository';
import { BotButtonsDataConstant } from '../constants/bot-buttons-data.constant';
import { AccountRepository } from '../../account/account.repository';
import { AmoApiService } from '../../amo-api/amo-api.service';
import { generateKeyboardByMessageSettings } from '../helpers/generate-keyboard.helper';

type TelegrafContext = Scenes.SceneContext;

@UpdateDecorator()
export class BotUnsortedActionsService extends Telegraf<TelegrafContext> {
    constructor(
        private readonly configService: ConfigService,
        private readonly logger: MarlboroLoggerService,
        private readonly subscriberMessageRepository: BotSubscriberMessageRepository,
        private readonly accountRepository: AccountRepository,
        private readonly amoApiService: AmoApiService
    ) {
        super(configService.get('BOT_TOKEN'));
    }

    @Action(BotButtonsDataConstant.Unsorted.Accept)
    private async acceptUnsortedLeadAction(@Ctx() acceptClickCtx: ActionCustomContext): Promise<void> {
        const loggerContext = `${BotUnsortedActionsService.name}/${this.acceptUnsortedLeadAction.name}`;

        try {
            const currentChatId = acceptClickCtx.update.callback_query.message.chat.id;

            const currentMessageId = acceptClickCtx.update.callback_query.message.message_id;

            const currentMessageData = await this.subscriberMessageRepository.getSubscriberMessage(currentChatId, currentMessageId);

            const appAccount = await this.accountRepository.getAccountById(currentMessageData.accountId);

            const accessInformation = {
                accountId: appAccount.id,
                token: appAccount.accessToken,
            };

            const unsortedData = await this.amoApiService.getUnsortedLeads(accessInformation);

            const currentUnsortedLead = unsortedData._embedded.unsorted.find((unsortedLead) => {
                const [lead] = unsortedLead._embedded.leads;

                if (lead.id === currentMessageData.boundLeadId) {
                    return unsortedLead;
                }
            });

            const currentTelegramUser = await this.accountRepository.getTelegramUser(appAccount.id, acceptClickCtx.from.id);

            await this.amoApiService.acceptUnsortedLead(accessInformation, currentUnsortedLead.uid, currentTelegramUser.amoUserId);

            currentMessageData.hookMessageSettings.isUnsortedPipelineStage = false;

            await this.subscriberMessageRepository.updateSubscriberMessage(currentMessageData);

            const acceptUnsortedLeadMessage = `Пользователь ${
                currentTelegramUser.amoUserName ? currentTelegramUser.amoUserName : acceptClickCtx.from.username
            } принял сделку!`;

            await acceptClickCtx.editMessageText(`${acceptUnsortedLeadMessage}\n\n${currentMessageData.hookMessageData.preparedMessage}`, {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(generateKeyboardByMessageSettings(currentMessageData.hookMessageSettings)),
            });

            this.logger.info(`Пользователь ${acceptClickCtx.from.username} с id ${acceptClickCtx.from.id} принял сделку!`, loggerContext);
        } catch (error) {
            this.logger.error(error, loggerContext);
        }
    }

    @Action(BotButtonsDataConstant.Unsorted.Reject)
    private async rejectUnsortedLeadAction(@Ctx() rejectClickCtx: ActionCustomContext): Promise<void> {
        const loggerContext = `${BotUnsortedActionsService.name}/${this.rejectUnsortedLeadAction.name}`;

        try {
            const currentChatId = rejectClickCtx.update.callback_query.message.chat.id;

            const currentMessageId = rejectClickCtx.update.callback_query.message.message_id;

            const currentMessageData = await this.subscriberMessageRepository.getSubscriberMessage(currentChatId, currentMessageId);

            const appAccount = await this.accountRepository.getAccountById(currentMessageData.accountId);

            const accessInformation = {
                accountId: appAccount.id,
                token: appAccount.accessToken,
            };

            const unsortedData = await this.amoApiService.getUnsortedLeads(accessInformation);

            const currentUnsortedLead = unsortedData._embedded.unsorted.find((unsortedLead) => {
                const [lead] = unsortedLead._embedded.leads;

                if (lead.id === currentMessageData.boundLeadId) {
                    return unsortedLead;
                }
            });

            const currentTelegramUser = await this.accountRepository.getTelegramUser(appAccount.id, rejectClickCtx.from.id);

            await this.amoApiService.rejectUnsortedLead(accessInformation, currentUnsortedLead.uid, currentTelegramUser.amoUserId);

            await this.subscriberMessageRepository.deleteSubscriberMessage(currentMessageData);

            await rejectClickCtx.deleteMessage();

            const rejectedMessage = `<b>Сделка была отклонена!</b>\n\nОтклонивший пользователь: ${
                currentTelegramUser.amoUserName ? currentTelegramUser.amoUserName : rejectClickCtx.from.username
            }`;

            await rejectClickCtx.sendMessage(rejectedMessage, { parse_mode: 'HTML' });
        } catch (error) {
            this.logger.error(error, loggerContext);
        }
    }
}
