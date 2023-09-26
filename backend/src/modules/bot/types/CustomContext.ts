import { NarrowedContext, Scenes } from 'telegraf';
import { CallbackQuery, Message, Update } from 'typegram';

export type CustomContext = NarrowedContext<
    Scenes.WizardContext<Scenes.WizardSessionData>,
    { message: Update.New & Update.NonChannel & Message.MigrateToChatIdMessage; update_id: number }
>;

export type ActionCustomContext = NarrowedContext<
    Scenes.SceneContext & { match: RegExpExecArray },
    Update.CallbackQueryUpdate<CallbackQuery>
>;
