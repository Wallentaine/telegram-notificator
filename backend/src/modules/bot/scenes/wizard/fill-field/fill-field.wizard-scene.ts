import { Ctx, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardScenesIds } from '../../../constants/scenes.constant';
import { MarlboroLoggerService } from '../../../../../core/marlboro-logger/marlboro-logger.service';
import { CallbackQuery, Update } from 'typegram';
import { Context, Markup, Scenes } from 'telegraf';
import { generateKeyboardByMessageSettings, generateKeyboardFillFields } from '../../../helpers/generate-keyboard.helper';
import { BotSubscriberMessageRepository } from '../../../bot.subscriber-message.repository';

@Wizard(WizardScenesIds.FillFieldId)
export class FillFieldWizardScene {
    constructor(
        private readonly logger: MarlboroLoggerService,
        private readonly subscriberMessageRepository: BotSubscriberMessageRepository
    ) {}

    @WizardStep(1)
    public async showFieldsButtons(@Ctx() ctx: Context<Update.CallbackQueryUpdate<CallbackQuery.DataQuery>> & Scenes.WizardContext) {
        const loggerContext = `${FillFieldWizardScene.name}/${this.showFieldsButtons.name}`;

        try {
            const currentMessageId = ctx.update.callback_query.message.message_id;

            const currentChatId =
                ctx.update.callback_query.from.id === ctx.update.callback_query.message.chat.id
                    ? ctx.update.callback_query.from.id
                    : ctx.update.callback_query.message.chat.id;

            const currentMessageSettings = await this.subscriberMessageRepository.getSubscriberMessage(currentChatId, currentMessageId);

            await ctx.editMessageReplyMarkup({
                inline_keyboard: [
                    ...generateKeyboardFillFields(currentMessageSettings.hookMessageSettings.requestFillFields),
                    [Markup.button.callback('Назад', 'back')],
                ],
            });

            ctx.wizard.next();
        } catch (error) {
            this.logger.error(error, loggerContext);
        }
    }

    @WizardStep(2)
    private async showSelectedFieldInfo(@Ctx() ctx: Context<Update.CallbackQueryUpdate<CallbackQuery.DataQuery>> & Scenes.WizardContext) {
        const loggerContext = `${FillFieldWizardScene.name}/${this.showSelectedFieldInfo.name}`;

        try {
            const currentMessageId = ctx.update.callback_query.message.message_id;

            const currentChatId =
                ctx.update.callback_query.from.id === ctx.update.callback_query.message.chat.id
                    ? ctx.update.callback_query.from.id
                    : ctx.update.callback_query.message.chat.id;

            const currentMessageSettings = await this.subscriberMessageRepository.getSubscriberMessage(currentChatId, currentMessageId);

            const currentAction = ctx.update.callback_query.data;

            if (currentAction === 'back') {
                await ctx.editMessageReplyMarkup({
                    inline_keyboard: generateKeyboardByMessageSettings(currentMessageSettings.hookMessageSettings),
                });

                return await ctx.scene.leave();
            }

            const currentField = currentMessageSettings.hookMessageSettings.requestFillFields.find(
                (field) => field.fieldId.replace(/\D/g, '') === currentAction
            );

            ctx.wizard.next();
        } catch (error) {
            this.logger.error(error, loggerContext);
        }
    }

    @WizardStep(3)
    private async showMessageForEnterFieldValue() {}

    @WizardStep(4)
    private async updateFieldValueInAmoCrm() {}
}
