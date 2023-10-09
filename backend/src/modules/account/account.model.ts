import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AccountDocument = HydratedDocument<Account>;

export type TelegramUser = {
    telegramId: number;
    telegramUserName: string;
    amoUserId: number;
    amoUserName: string;
};

@Schema()
export class Account {
    @Prop({ required: true })
    public id: number;

    @Prop({ required: true })
    public accessToken: string;

    @Prop({ required: true })
    public refreshToken: string;

    @Prop({ required: true })
    public subdomain: string;

    @Prop({ required: true, default: true })
    public installed: boolean;

    @Prop({ required: true })
    public startUsingDate: string;

    @Prop({ required: true })
    public finishTrialDate: string;

    @Prop({ required: false, default: '' })
    public finishPaymentDate: string;

    @Prop({ required: true, default: true })
    public isTrial: boolean;

    @Prop({ required: true, default: false })
    public isPaid: boolean;

    @Prop({ required: true, default: true })
    public isActive: boolean;

    @Prop({ required: false, default: [] })
    public telegramUsers: TelegramUser[];
}

export const AccountSchema = SchemaFactory.createForClass(Account);
