import { Update as UpdateDecorator, Ctx, Action } from 'nestjs-telegraf';
import { Context, Scenes, Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { BotButtonsDataConstant } from '../constants/bot-buttons-data.constant';
import { CallbackQuery, Update } from 'typegram';
import { WizardScenesIds } from '../constants/scenes.constant';
import { MarlboroLoggerService } from '../../../core/marlboro-logger/marlboro-logger.service';

type TelegrafContext = Scenes.SceneContext;

@UpdateDecorator()
export class BotFillFieldActionService extends Telegraf<TelegrafContext> {
    constructor(
        private readonly configService: ConfigService,
        private readonly logger: MarlboroLoggerService
    ) {
        super(configService.get('BOT_TOKEN'));
    }

    @Action(BotButtonsDataConstant.FieldFill)
    private async fillField(@Ctx() fillFieldCtx: Context<Update.CallbackQueryUpdate<CallbackQuery.DataQuery>> & Scenes.WizardContext) {
        const loggerContext = `${BotFillFieldActionService.name}/${this.fillField.name}`;

        try {
            await fillFieldCtx.scene.enter(WizardScenesIds.FillFieldId);
        } catch (error) {
            this.logger.error(error, loggerContext);
        }
    }
}
