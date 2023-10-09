import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Account, AccountDocument, TelegramUser } from './account.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MarlboroLoggerService } from '../../core/marlboro-logger/marlboro-logger.service';

@Injectable()
export class AccountRepository {
    constructor(
        @InjectModel(Account.name) private readonly accountModel: Model<Account>,
        private readonly logger: MarlboroLoggerService
    ) {}

    public async getAllAccounts(): Promise<AccountDocument[]> {
        const loggerContext = `${Account.name}/${this.getAccountById.name}`;

        try {
            return await this.accountModel.findOne({});
        } catch (error) {
            this.logger.error(error, loggerContext);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

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
            const newAccount = new this.accountModel(accountInfo);

            return await newAccount.save();
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

    public async getTelegramUsers(accountId: number): Promise<TelegramUser[]> {
        const loggerContext = `${Account.name}/${this.getTelegramUsers.name}`;

        try {
            const appAccount = await this.getAccountById(accountId);

            return appAccount.telegramUsers;
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

    public async updateTelegramUser(appAccount: AccountDocument, user: TelegramUser): Promise<void> {
        const loggerContext = `${Account.name}/${this.updateTelegramUser.name}`;

        try {
            appAccount.telegramUsers = [...appAccount.telegramUsers].map((telegramUser) => {
                if (telegramUser.telegramId === user.telegramId) {
                    return user;
                }

                return telegramUser;
            });

            await appAccount.save();
        } catch (error) {
            this.logger.error(error, loggerContext);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async addTelegramUser(appAccount: AccountDocument, user: TelegramUser): Promise<void> {
        const loggerContext = `${Account.name}/${this.addTelegramUser.name}`;

        try {
            appAccount.telegramUsers = [...appAccount.telegramUsers, user];

            await appAccount.save();
        } catch (error) {
            this.logger.error(error, loggerContext);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async deleteTelegramUser(appAccount: AccountDocument, user: TelegramUser): Promise<void> {
        const loggerContext = `${Account.name}/${this.deleteTelegramUser.name}`;

        try {
            appAccount.telegramUsers = [...appAccount.telegramUsers].filter((telegramUser) => telegramUser.telegramId !== user.telegramId);

            await appAccount.save();
        } catch (error) {
            this.logger.error(error, loggerContext);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
