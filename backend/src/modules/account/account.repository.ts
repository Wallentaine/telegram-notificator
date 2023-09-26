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
}
