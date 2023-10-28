import { MessageSettings } from '../types/message-settings.types';
import { CustomInlineKeyboard } from '../types/custom-inline-keyboard.types';
import { Markup } from 'telegraf';
import { BotButtonsDataConstant } from '../constants/bot-buttons-data.constant';
import { FillField, SwapStage } from '../dto/digital-pipeline-hook.dto';

export function generateKeyboardByMessageSettings(hookSettings: MessageSettings): CustomInlineKeyboard[][] {
    const keyboard: CustomInlineKeyboard[][] = [];

    if (!hookSettings.isUnsortedPipelineStage && hookSettings.requiredFillFields) {
        keyboard.push([Markup.button.callback('Заполнить поля', BotButtonsDataConstant.FieldFill)]);
    }

    if (!hookSettings.isUnsortedPipelineStage && hookSettings.requiredSwapStage) {
        keyboard.push([Markup.button.callback('Смена этапа', BotButtonsDataConstant.SwapStage)]);
    }

    if (hookSettings.isUnsortedPipelineStage) {
        keyboard.push([
            Markup.button.callback('Принять', BotButtonsDataConstant.Unsorted.Accept),
            Markup.button.callback('Отклонить', BotButtonsDataConstant.Unsorted.Reject),
        ]);
    }

    return keyboard;
}

export function generateKeyboardFillFields(fillFields: FillField[]) {
    const keyboard: CustomInlineKeyboard[][] = [];

    fillFields.forEach(({ fieldId, fieldName }) => {
        keyboard.push([Markup.button.callback(fieldName, fieldId)]);
    });

    return keyboard;
}

export function generateKeyboardSwapStage(stages: SwapStage[]) {
    const keyboard: CustomInlineKeyboard[][] = [];

    stages.forEach(({ stageId, stageName }) => {
        keyboard.push([Markup.button.callback(stageName, String(stageId))]);
    });

    return keyboard;
}
