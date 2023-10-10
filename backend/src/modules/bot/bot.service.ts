import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GetTelegramUsersDto } from './dto/get-telegram-users.dto';
import { AccountRepository } from '../account/account.repository';
import { MarlboroLoggerService } from '../../core/marlboro-logger/marlboro-logger.service';
import { TelegramUser } from '../account/account.model';
import { DigitalPipelineHookDto } from './dto/digital-pipeline-hook.dto';
import { UpdateTelegramUsersDto } from './dto/update-telegram-users.dto';
import { AmoApiService } from '../amo-api/amo-api.service';
import interpolation from '../../core/helpers/interpolation';
import { Scenes, Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { RegexExpressions } from '../../core/helpers/interpolation/consts/regexExpressions';
import { BotNotifyService } from './bot-interactions-services/bot-notify.service';
import { ReceivedMessageData } from './types/received-message.data';
import { MessageSettings } from './types/message-settings.types';
import { NoteTypes } from '../amo-api/constants/note-types';
import { BoundLead } from './types/bound-lead.types';

type TelegrafContext = Scenes.SceneContext;

const COUNT_NOTES_FOR_SEND = 3;

@Injectable()
export class BotService extends Telegraf<TelegrafContext> {
    constructor(
        private readonly configService: ConfigService,
        private readonly accountRepository: AccountRepository,
        private readonly logger: MarlboroLoggerService,
        private readonly amoApiService: AmoApiService,
        private readonly notifyService: BotNotifyService
    ) {
        super(configService.get('BOT_TOKEN'));
    }

    public async notify(hook: DigitalPipelineHookDto) {
        const loggerContext = `${BotService.name}/${this.notify.name}`;

        try {
            const appAccount = await this.accountRepository.getAccountById(hook.account_id);

            if (!appAccount) {
                this.logger.error(`Account with id ${hook.account_id} and subdomain ${hook.subdomain} not found!`, loggerContext);
                return new HttpException(
                    `Account with id ${hook.account_id} and subdomain ${hook.subdomain} not found!`,
                    HttpStatus.NOT_FOUND
                );
            }

            const leadId: number = Number(hook.event.data.id);

            const accessInformation = {
                accountId: appAccount.id,
                token: appAccount.accessToken,
            };

            const boundLeadWithEntities: BoundLead = {
                lead: await this.amoApiService.getDeal(accessInformation, leadId, ['contacts']),
                contact: null,
                company: null,
            };

            const pickedEntities = interpolation.getPickedEntities(boundLeadWithEntities.lead._embedded);

            const mainContact = pickedEntities?.contacts?.length ? interpolation.getMainContact(pickedEntities.contacts) : null;

            const [company] = pickedEntities?.companies?.length ? pickedEntities.companies : [null];

            boundLeadWithEntities.contact = mainContact ? await this.amoApiService.getContactById(accessInformation, mainContact.id) : null;

            boundLeadWithEntities.company = company ? await this.amoApiService.getCompanyById(accessInformation, company.id) : null;

            const receivedHookSettings = hook.action.settings.widget.settings;

            const hookMessageData: ReceivedMessageData = {
                receivedMessage: receivedHookSettings.message,
                preparedMessage: null,
            };

            if (interpolation.isExistInterpolation(hookMessageData.receivedMessage)) {
                hookMessageData.preparedMessage = interpolation.interpolateText(
                    hookMessageData.receivedMessage,
                    boundLeadWithEntities.lead,
                    boundLeadWithEntities.contact,
                    boundLeadWithEntities.company
                );
            }

            hookMessageData.preparedMessage = hookMessageData.receivedMessage.replace(RegexExpressions.SearchEnter, '\n');

            const subscribers = hook.action.settings.widget.settings.subscribers;

            const hookSettingsData: MessageSettings = {
                requiredSwapStage: receivedHookSettings.requiredSwapStage,
                requestSwapStage: receivedHookSettings.requestSwapStage,
                requiredFillFields: receivedHookSettings.requiredFillFields,
                requestFillFields: receivedHookSettings.requestFillFields,
                requiredUnsortedDescription: receivedHookSettings.requiredUnsortedDescription,
                isUnsortedPipelineStage: false,
            };

            if (hookSettingsData.requiredUnsortedDescription) {
                const notes = await this.amoApiService.getNotesByLeadId(accessInformation, leadId);

                const filteredNotesByText = notes.filter((note) => note.note_type === NoteTypes.Common && 'text' in note?.params);

                hookMessageData.preparedMessage += filteredNotesByText?.length && '\n\n' + 'Примечания:' + '\n';

                filteredNotesByText.length > COUNT_NOTES_FOR_SEND && filteredNotesByText.splice(-COUNT_NOTES_FOR_SEND);

                filteredNotesByText.forEach((note) => {
                    hookMessageData.preparedMessage += 'text' in note?.params && note.params.text + '\n';
                });
            }

            for (const subscriber of subscribers) {
                await this.notifyService.sendMessage(subscriber, boundLeadWithEntities.lead.id, hookMessageData, hookSettingsData);
            }

            this.logger.info(`All messages send account => ${appAccount.id}, subscribers => ${subscribers.join(', ')}`, loggerContext);
        } catch (error) {
            this.logger.error(error, loggerContext);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async getTelegramUsers(dto: GetTelegramUsersDto): Promise<TelegramUser[]> {
        const loggerContext = `${BotService.name}/${this.getTelegramUsers.name}`;

        try {
            return this.accountRepository.getTelegramUsers(dto.accountId);
        } catch (error) {
            this.logger.error(error, loggerContext);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async updateTelegramUsers(accountId: number, users: UpdateTelegramUsersDto[]) {
        const loggerContext = `${BotService.name}/${this.updateTelegramUsers.name}`;

        const appAccount = await this.accountRepository.getAccountById(accountId);

        if (!appAccount) {
            this.logger.error('Account not found', loggerContext);
            return new HttpException('Account not found!', HttpStatus.NOT_FOUND);
        }

        try {
            for (const user of users) {
                if (
                    !appAccount.telegramUsers.find((telegramUser) => telegramUser.telegramId === user.telegramId) &&
                    user.action in ['deleted', 'edit']
                ) {
                    this.logger.error(`User with id => ${user.telegramId} and name => ${user.telegramUserName} not found`, loggerContext);
                    continue;
                }

                const userWithoutActions: TelegramUser = {
                    telegramId: user.telegramId,
                    telegramUserName: user.telegramUserName,
                    amoUserId: user.amoUserId || null,
                    amoUserName: user.amoUserName || null,
                };

                switch (user.action) {
                    case 'deleted':
                        await this.accountRepository.deleteTelegramUser(appAccount, userWithoutActions);
                        break;
                    case 'create':
                        await this.accountRepository.addTelegramUser(appAccount, userWithoutActions);
                        break;
                    case 'edit':
                        await this.accountRepository.updateTelegramUser(appAccount, userWithoutActions);
                        break;
                }
            }
        } catch (error) {
            this.logger.error(error, loggerContext);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
