import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Account, AccountDocument } from './account.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MarlboroLoggerService } from '../marlboro-logger/marlboro-logger.service';

@Injectable()
export class AccountRepository {
    constructor(
        @InjectModel(Account.name) private readonly accountModel: Model<Account>,
        private readonly logger: MarlboroLoggerService
    ) {}

    public async getAccountById(accountId: number): Promise<AccountDocument> {
        const loggerContext = `${Account.name}/${this.getAccountById.name}`;

        try {
            return await this.accountModel.findOne({ id: accountId });
        } catch (error) {
            this.logger.error(error, loggerContext);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async createAccount(accountInfo: Account): Promise<AccountDocument> {
        const loggerContext = `${Account.name}/${this.createAccount.name}`;

        try {
            const newUser = new this.accountModel(accountInfo);

            return await newUser.save();
        } catch (error) {
            this.logger.error(error, loggerContext);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async updateAccountByID(accountInfo: AccountDocument): Promise<AccountDocument> {
        const loggerContext = `${Account.name}/${this.updateAccountByID.name}`;

        try {
            return await accountInfo.save();
        } catch (error) {
            this.logger.error(error, loggerContext);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async getAccountByTelegramUserId(telegramUserId: number): Promise<AccountDocument> {
        const loggerContext = `${Account.name}/${this.getAccountByTelegramUserId.name}`;

        try {
            return await this.accountModel.findOne({ 'telegramUsers.telegramId': telegramUserId });
        } catch (error) {
            this.logger.error(error, loggerContext);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async getAccountsByTelegramUserId(telegramUserId: number): Promise<AccountDocument[]> {
        const loggerContext = `${Account.name}/${this.getAccountsByTelegramUserId.name}`;

        try {
            const accounts: AccountDocument[] = [];

            for await (const appAccount of this.accountModel.find({ 'telegramUsers.telegramId': telegramUserId })) {
                accounts.push(appAccount);
            }

            return accounts;
        } catch (error) {
            this.logger.error(error, loggerContext);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async migrateChat(oldChatId: number, newChatId: number): Promise<void> {
        const loggerContext = `${Account.name}/${this.migrateChat.name}`;

        try {
            for await (const appAccount of this.accountModel.find({ 'telegramUsers.telegramId': oldChatId })) {
                appAccount.telegramUsers = [...appAccount.telegramUsers].map((telegramUser) => {
                    if (telegramUser.telegramId === oldChatId) {
                        return {
                            ...telegramUser,
                            telegramId: newChatId,
                        };
                    }
                    return telegramUser;
                });

                await this.updateAccountByID(appAccount);
            }
        } catch (error) {
            this.logger.error(error, loggerContext);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
