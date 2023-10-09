import { DigitalPipelineSettingsWidgetSettings } from '../dto/digital-pipeline-hook.dto';

export type MessageSettings = Omit<DigitalPipelineSettingsWidgetSettings, 'message' | 'subscribers'> & {
    isUnsortedPipelineStage: boolean;
};
