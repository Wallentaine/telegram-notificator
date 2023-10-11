import { Update as UpdateDecorator } from 'nestjs-telegraf';
import { Markup, Scenes, Telegraf } from 'telegraf';
import { MarlboroLoggerService } from '../../../core/marlboro-logger/marlboro-logger.service';
import { ConfigService } from '@nestjs/config';
import { ReceivedMessageData } from '../types/received-message.data';
import { MessageSettings } from '../types/message-settings.types';
import { BotSubscriberMessage } from '../bot.subscriber-message.model';
import { BotSubscriberMessageRepository } from '../bot.subscriber-message.repository';
import { generateKeyboardByMessageSettings } from '../helpers/generate-keyboard.helper';

type TelegrafContext = Scenes.SceneContext;

@UpdateDecorator()
export class BotNotifyService extends Telegraf<TelegrafContext> {
    constructor(
        private readonly configService: ConfigService,
        private readonly subscriberMessageRepository: BotSubscriberMessageRepository,
        private readonly logger: MarlboroLoggerService
    ) {
        super(configService.get('BOT_TOKEN'));
    }

    async sendMessage(
        accountId: number,
        subscriber: number,
        boundLeadId: number,
        messageData: ReceivedMessageData,
        hookSettings: MessageSettings
    ): Promise<void> {
        const loggerContext = `${BotNotifyService.name}/${this.sendMessage.name}`;

        try {
            const sentMessage = await this.telegram.sendMessage(subscriber, messageData.preparedMessage, {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(generateKeyboardByMessageSettings(hookSettings)),
            });

            const newSubscriberMessage: BotSubscriberMessage = {
                accountId,
                subscriberId: subscriber,
                messageId: sentMessage.message_id,
                boundLeadId,
                hookMessageData: messageData,
                hookMessageSettings: hookSettings,
            };

            await this.subscriberMessageRepository.addSubscriberMessage(newSubscriberMessage);
        } catch (error) {
            this.logger.error(error, loggerContext);
        }
    }
}
