import { Update as UpdateDecorator, Ctx, Action } from 'nestjs-telegraf';
import { Context, Scenes, Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { BotButtonsDataConstant } from '../constants/bot-buttons-data.constant';
import { CallbackQuery, Update } from 'typegram';
import { WizardScenesIds } from '../constants/scenes.constant';
import { MarlboroLoggerService } from '../../../core/marlboro-logger/marlboro-logger.service';

type TelegrafContext = Scenes.SceneContext;

@UpdateDecorator()
export class BotSwapStageActionsService extends Telegraf<TelegrafContext> {
    constructor(
        private readonly configService: ConfigService,
        private readonly logger: MarlboroLoggerService
    ) {
        super(configService.get('BOT_TOKEN'));
    }

    @Action(BotButtonsDataConstant.SwapStage)
    private async swapStage(@Ctx() swapStageCtx: Context<Update.CallbackQueryUpdate<CallbackQuery.DataQuery>> & Scenes.WizardContext) {
        const loggerContext = `${BotSwapStageActionsService.name}/${this.swapStage.name}`;

        try {
            await swapStageCtx.scene.enter(WizardScenesIds.SwapStageId);
        } catch (error) {
            this.logger.error(error, loggerContext);
        }
    }
}
