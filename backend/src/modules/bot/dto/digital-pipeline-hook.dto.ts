import { Transform } from '@nestjs/class-transformer';
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

class DigitalPipelineSettingsWidget {
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

export class DigitalPipelineSettingsWidgetSettings {
    @IsArray()
    @IsInt({ each: true })
    @Transform(({ value }) => value.trim().split(',').map(Number).filter(Boolean))
    subscribers: number[];

    @IsString()
    message: string;

    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    requiredSwapStage: boolean;

    requestSwapStage: string;

    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    requiredFillFields: boolean;

    requestFillFields: string;

    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    requiredUnsortedDescription: boolean;
}

class DigitalPipelineSettings {
    widget: DigitalPipelineSettingsWidget;

    widget_info: DigitalPipelineSettingsWidgetInfo;

    optional_conditions: DigitalPipelineSettingsOptionalConditions;

    created_by: string;

    row: number;
}

class DigitalPipelineAction {
    code: string;

    settings: DigitalPipelineSettings;
}

export class DigitalPipelineHookDto {
    event: DigitalPipelineEvent;

    action: DigitalPipelineAction;

    subdomain: string;

    @IsInt()
    @Transform((value) => Number(value))
    account_id: number;
}
