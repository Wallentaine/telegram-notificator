import { NarrowedContext, Scenes } from 'telegraf';
import { CallbackQuery, Message, Update } from 'typegram';

export type CustomMessage = { message: Update.New & Update.NonChannel & Message.MigrateToChatIdMessage; update_id: number };

export type CustomContextTypes = NarrowedContext<Scenes.WizardContext<Scenes.WizardSessionData>, CustomMessage>;

export type CustomChannelMessage = { channel_post: Update.New & Update.Channel & Message.MigrateToChatIdMessage; update_id: number };

export type CustomChannelContext = NarrowedContext<Scenes.WizardContext<Scenes.WizardSessionData>, CustomChannelMessage>;

export type ActionCustomContext = NarrowedContext<
    Scenes.SceneContext & { match: RegExpExecArray },
    Update.CallbackQueryUpdate<CallbackQuery>
>;
