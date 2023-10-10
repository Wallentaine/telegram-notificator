import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ReceivedMessageData } from './types/received-message.data';
import { MessageSettings } from './types/message-settings.types';

export type BotSubscriberMessageDocument = HydratedDocument<BotSubscriberMessage>;

@Schema()
export class BotSubscriberMessage {
    @Prop({ required: true })
    public subscriberId: number;

    @Prop({ required: true })
    public messageId: number;

    @Prop({ required: true })
    public boundLeadId: number;

    @Prop({
        required: true,
        type: Object({
            receivedMessage: String,
            preparedMessage: String,
        }),
    })
    public hookMessageData: ReceivedMessageData;

    @Prop({
        required: true,
        type: Object({
            requiredSwapStage: Boolean,
            requestSwapStage: String,
            requiredFillFields: Boolean,
            requestFillFields: String,
            isUnsortedPipelineStage: Boolean,
        }),
    })
    public hookMessageSettings: MessageSettings;
}

export const BotSubscriberMessageSchema = SchemaFactory.createForClass(BotSubscriberMessage);
