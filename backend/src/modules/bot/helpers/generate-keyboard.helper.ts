import { MessageSettings } from '../types/message-settings.types';
import { CustomInlineKeyboard } from '../types/custom-inline-keyboard.types';
import { Markup } from 'telegraf';
import { BotButtonsData } from '../constants/bot-buttons-data';

export function generateKeyboardByMessageSettings(hookSettings: MessageSettings): CustomInlineKeyboard[][] {
    const keyboard: CustomInlineKeyboard[][] = [];

    if (!hookSettings.isUnsortedPipelineStage && hookSettings.requiredFillFields) {
        keyboard.push([Markup.button.callback('Заполнить поля', 'field-fill')]);
    }

    if (!hookSettings.isUnsortedPipelineStage && hookSettings.requiredSwapStage) {
        keyboard.push([Markup.button.callback('Смена этапа', 'swap-stage')]);
    }

    if (hookSettings.isUnsortedPipelineStage) {
        keyboard.push([
            Markup.button.callback('Принять', BotButtonsData.Unsorted.Accept),
            Markup.button.callback('Отклонить', BotButtonsData.Unsorted.Reject),
        ]);
    }

    return keyboard;
}
