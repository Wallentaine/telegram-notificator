import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsInt, IsString } from 'class-validator';

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
    @IsArray()
    @IsInt({ each: true })
    @Transform(({ value }) => value.split(',').map(Number).filter(Boolean))
    subscribers: number[];

    @IsString()
    message: string;

    @IsBoolean()
    @Transform(({ value }) => value === 'true', { toClassOnly: true })
    requiredSwapStage: boolean;

    requestSwapStage: string;

    @IsBoolean()
    @Transform(({ value }) => value === 'true', { toClassOnly: true })
    requiredFillFields: boolean;

    requestFillFields: string;

    @IsBoolean()
    @Transform(({ value }) => value === 'true', { toClassOnly: true })
    requiredUnsortedDescription: boolean;
}

class DigitalPipelineSettingsWidget {
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
    @Type(() => DigitalPipelineSettingsWidget)
    widget: DigitalPipelineSettingsWidget;

    widget_info: DigitalPipelineSettingsWidgetInfo;

    optional_conditions: DigitalPipelineSettingsOptionalConditions;

    created_by: string;

    row: number;
}

class DigitalPipelineAction {
    code: string;

    @Type(() => DigitalPipelineSettings)
    settings: DigitalPipelineSettings;
}

export class DigitalPipelineHookDto {
    event: DigitalPipelineEvent;

    @Type(() => DigitalPipelineAction)
    action: DigitalPipelineAction;

    subdomain: string;

    @IsInt()
    @Transform(({ value }) => Number(value), { toClassOnly: true })
    account_id: number;
}
