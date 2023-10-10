import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MarlboroLoggerService } from '../../core/marlboro-logger/marlboro-logger.service';
import { BotSubscriberMessage, BotSubscriberMessageDocument } from './bot.subscriber-message.model';

@Injectable()
export class BotSubscriberMessageRepository {
    constructor(
        @InjectModel(BotSubscriberMessage.name) private readonly subscriberMessageModel: Model<BotSubscriberMessage>,
        private readonly logger: MarlboroLoggerService
    ) {}

    public async addSubscriberMessage(subscriberMessage: BotSubscriberMessage): Promise<BotSubscriberMessageDocument> {
        const loggerContext = `${BotSubscriberMessageRepository.name}/${this.addSubscriberMessage.name}`;

        try {
            const newSubscriberMessage = new this.subscriberMessageModel(subscriberMessage);

            return await newSubscriberMessage.save();
        } catch (error) {
            this.logger.error(error, loggerContext);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async getSubscriberMessage(subscriberId: number, messageId: number): Promise<BotSubscriberMessageDocument> {
        const loggerContext = `${BotSubscriberMessageRepository.name}/${this.getSubscriberMessage.name}`;

        try {
            return await this.subscriberMessageModel.findOne({ subscriberId, messageId });
        } catch (error) {
            this.logger.error(error, loggerContext);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
