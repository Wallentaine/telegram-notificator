import { Update as UpdateDecorator } from 'nestjs-telegraf';
import { Markup, Scenes, Telegraf } from 'telegraf';
import { MarlboroLoggerService } from '../../core/marlboro-logger/marlboro-logger.service';
import { ConfigService } from '@nestjs/config';
import { ReceivedMessageData } from './types/received-message.data';
import { MessageSettings } from './types/message-settings.types';
import { CustomInlineKeyboard } from './types/custom-inline-keyboard.types';

type TelegrafContext = Scenes.SceneContext;

@UpdateDecorator()
export class BotNotifyService extends Telegraf<TelegrafContext> {
    constructor(
        private readonly configService: ConfigService,
        private readonly logger: MarlboroLoggerService
    ) {
        super(configService.get('BOT_TOKEN'));
    }

    async sendMessage(subscriber: number, messageData: ReceivedMessageData, hookSettings: MessageSettings): Promise<void> {
        const loggerContext = `${BotNotifyService.name}/${this.sendMessage.name}`;

        try {
            const keyboard: CustomInlineKeyboard[][] = [];

            if (hookSettings.requiredFillFields) {
                keyboard.push([Markup.button.callback('Заполнить поля', 'field-fill')]);
            }

            if (hookSettings.requiredSwapStage) {
                keyboard.push([Markup.button.callback('Смена этапа', 'swap-stage')]);
            }

            if (hookSettings.isUnsortedPipelineStage) {
                keyboard.push([
                    Markup.button.callback('Принять', 'accept-unsorted-deal'),
                    Markup.button.callback('Отклонить', 'reject-unsorted-deal'),
                ]);
            }

            await this.telegram.sendMessage(subscriber, messageData.preparedMessage, {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard(keyboard),
            });
        } catch (error) {
            this.logger.error(error, loggerContext);
        }
    }
}
