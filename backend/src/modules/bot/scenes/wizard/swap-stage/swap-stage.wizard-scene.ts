import { Ctx, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardScenesIds } from '../../../constants/scenes.constant';
import { MarlboroLoggerService } from '../../../../../core/marlboro-logger/marlboro-logger.service';
import { BotSubscriberMessageRepository } from '../../../bot.subscriber-message.repository';
import { Context, Markup, Scenes } from 'telegraf';
import { CallbackQuery, Update } from 'typegram';
import { generateKeyboardByMessageSettings, generateKeyboardSwapStage } from '../../../helpers/generate-keyboard.helper';

@Wizard(WizardScenesIds.SwapStageId)
export class SwapStageWizardScene {
    constructor(
        private readonly logger: MarlboroLoggerService,
        private readonly subscriberMessageRepository: BotSubscriberMessageRepository
    ) {}

    @WizardStep(1)
    private async showStagesButtons(@Ctx() ctx: Context<Update.CallbackQueryUpdate<CallbackQuery.DataQuery>> & Scenes.WizardContext) {
        const loggerContext = `${SwapStageWizardScene.name}/${this.showStagesButtons.name}`;

        try {
            const currentMessageId = ctx.update.callback_query.message.message_id;

            const currentChatId =
                ctx.update.callback_query.from.id === ctx.update.callback_query.message.chat.id
                    ? ctx.update.callback_query.from.id
                    : ctx.update.callback_query.message.chat.id;

            const currentMessageSettings = await this.subscriberMessageRepository.getSubscriberMessage(currentChatId, currentMessageId);

            await ctx.editMessageReplyMarkup({
                inline_keyboard: [
                    ...generateKeyboardSwapStage(currentMessageSettings.hookMessageSettings.requestSwapStage),
                    [Markup.button.callback('Назад', 'back')],
                ],
            });

            ctx.wizard.next();
        } catch (error) {
            this.logger.error(error, loggerContext);
        }
    }

    @WizardStep(2)
    private async selectStage(@Ctx() ctx: Context<Update.CallbackQueryUpdate<CallbackQuery.DataQuery>> & Scenes.WizardContext) {
        const loggerContext = `${SwapStageWizardScene.name}/${this.selectStage.name}`;

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
        } catch (error) {
            this.logger.error(error, loggerContext);
        }
    }
}
