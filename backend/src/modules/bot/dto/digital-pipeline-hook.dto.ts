import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsInt, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FillField {
    fieldId: string;

    fieldName: string;
}

export class SwapStage {
    stageId: number;

    stageName: string;
}

class DigitalPipelineEventData {
    id: number;

    element_type: number;

    status_id: string;

    pipeline_id: string;
}

class DigitalPipelineEvent {
    type: number;

    type_code: string;

    data: DigitalPipelineEventData;

    time: number;
}

export class DigitalPipelineSettingsWidgetSettings {
    @ApiProperty({ example: '123321,321123,23123', description: 'Подписчики' })
    @IsArray()
    @IsInt({ each: true })
    @Transform(({ value }) => value.trim().split(',').map(Number).filter(Boolean))
    subscribers: number[];

    @IsString()
    message: string;

    @IsBoolean()
    @Transform(({ value }) => value === 'true', { toClassOnly: true })
    requiredSwapStage: boolean;

    @ApiProperty({
        example: '{"52214284":"Принимают решение","52214287":"Согласование договора"}',
        description: '"Разрешённые этапы для смены"',
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SwapStage)
    @Transform(({ value }): SwapStage[] => {
        const result: SwapStage[] = [];

        const parsedValue = JSON.parse(value);

        if (!parsedValue) {
            return [];
        }

        for (const key in parsedValue) {
            const stage = {
                stageId: Number(key),
                stageName: parsedValue[key],
            };

            result.push(stage);
        }

        return result;
    })
    requestSwapStage: SwapStage[];

    @IsBoolean()
    @Transform(({ value }) => value === 'true', { toClassOnly: true })
    requiredSwapStageOnce: boolean;

    @IsBoolean()
    @Transform(({ value }) => value === 'true', { toClassOnly: true })
    requiredFillFields: boolean;

    @ApiProperty({
        example: '{"fields":[{"fieldId":"contacts_field_id:2989899","fieldName":"Дата рождения контакта"}]}',
        description: 'Поля для заполнения',
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FillField)
    @Transform(({ value }): FillField[] => {
        const parsedValue = JSON.parse(value) || { fields: [] };
        if (parsedValue) {
            return parsedValue.fields;
        } else {
            return [];
        }
    })
    requestFillFields: FillField[];

    @IsBoolean()
    @Transform(({ value }) => value === 'true', { toClassOnly: true })
    requiredFillFieldsOnce: boolean;

    @IsBoolean()
    @Transform(({ value }) => value === 'true', { toClassOnly: true })
    requiredDescription: boolean;
}

class DigitalPipelineSettingsWidget {
    @ApiProperty({ example: 'example', description: 'Раздел с настройками виджета триггера' })
    @Type(() => DigitalPipelineSettingsWidgetSettings)
    settings: DigitalPipelineSettingsWidgetSettings;
}

class DigitalPipelineSettingsWidgetInfo {
    id: number;

    code: string;

    name: string;
}

class DigitalPipelineSettingsOptionalConditions {
    main_event: number;
}

class DigitalPipelineSettings {
    @ApiProperty({ example: 'example', description: 'Раздел с данными виджета' })
    @Type(() => DigitalPipelineSettingsWidget)
    widget: DigitalPipelineSettingsWidget;

    widget_info: DigitalPipelineSettingsWidgetInfo;

    optional_conditions: DigitalPipelineSettingsOptionalConditions;

    created_by: string;

    row: number;
}

class DigitalPipelineAction {
    code: string;

    @ApiProperty({ example: 'example', description: 'Раздел с настройками триггера' })
    @Type(() => DigitalPipelineSettings)
    settings: DigitalPipelineSettings;
}

export class DigitalPipelineHookDto {
    @ApiProperty({ example: 'example', description: 'Раздел с данными о событии' })
    event: DigitalPipelineEvent;

    @ApiProperty({
        example: { code: 'asdda', settings: { widget: { settings: { subscribers: '123312, 312312, 123123' } } } },
        description: 'Раздел с данными о экшене',
    })
    @Type(() => DigitalPipelineAction)
    action: DigitalPipelineAction;

    @ApiProperty({ example: 'example', description: 'Сабдомен пользователя' })
    subdomain: string;

    @ApiProperty({ example: 31231, description: 'Id аккаунта пользователя' })
    @IsInt()
    @Transform(({ value }) => Number(value), { toClassOnly: true })
    account_id: number;
}
