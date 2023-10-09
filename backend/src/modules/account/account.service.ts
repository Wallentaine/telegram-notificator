import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AmoApiService } from '../amo-api/amo-api.service';
import { Account, AccountDocument } from './account.model';
import { AccountRepository } from './account.repository';
import dayjs from 'dayjs';
import { getEndOfTrialPeriodDate, getStartUsingDate } from '../../core/helpers/calculate-trial-period.helper';
import { MarlboroLoggerService } from '../../core/marlboro-logger/marlboro-logger.service';
import { CronSettings } from './constants/cron-settings';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AccountService {
    constructor(
        private readonly amoApiService: AmoApiService,
        private readonly accountRepository: AccountRepository,
        private readonly logger: MarlboroLoggerService
    ) {}

    public async install({ referer, code }: { referer: string; code: string }): Promise<AccountDocument | HttpException> {
        const loggerContext = `${AccountService.name}/${this.install.name}`;

        try {
            const [accountSubdomain = null]: string[] = referer?.split('.') || [];

            if (!accountSubdomain || !code) {
                this.logger.error('No subdomain or code was passed!', loggerContext);
                return new HttpException('No subdomain or code was passed!', HttpStatus.BAD_REQUEST);
            }

            const tokenData = await this.amoApiService.requestAccessToken(accountSubdomain, code);

            if (!tokenData) {
                this.logger.error('Failed to log in!', loggerContext, accountSubdomain);
                return new HttpException('Failed to log in!!', HttpStatus.UNAUTHORIZED);
            }

            const accountData = await this.amoApiService.getAccountData(accountSubdomain, tokenData.access_token);

            if (!accountData) {
                this.logger.error('Failed to retrieve user information!', loggerContext, accountSubdomain);
                return new HttpException('Failed to retrieve user information!', HttpStatus.NOT_FOUND);
            }

            const appAccount = await this.accountRepository.getAccountById(accountData.id);

            if (!appAccount) {
                const newAccount: Account = {
                    id: accountData.id,
                    accessToken: tokenData.access_token,
                    refreshToken: tokenData.refresh_token,
                    subdomain: accountSubdomain,
                    installed: true,
                    startUsingDate: getStartUsingDate(),
                    finishTrialDate: getEndOfTrialPeriodDate(dayjs()),
                    finishPaymentDate: '',
                    isTrial: true,
                    isPaid: false,
                    isActive: true,
                    telegramUsers: [],
                };

                const installedAccount = await this.accountRepository.createAccount(newAccount);

                this.logger.info('Widget has been installed and account added to DataBase!', loggerContext);

                return installedAccount;
            }

            appAccount.installed = true;
            appAccount.accessToken = tokenData.access_token;
            appAccount.refreshToken = tokenData.refresh_token;

            const installedAccount = await this.accountRepository.updateAccountByID(appAccount);

            this.logger.info('Widget has been installed and account updated in DataBase!', loggerContext);

            return installedAccount;
        } catch (error) {
            this.logger.error(error, loggerContext);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async unInstall({ account_id }: { account_id: string }): Promise<AccountDocument | HttpException> {
        const loggerContext = `${AccountService.name}/${this.unInstall.name}`;

        try {
            const accountId = Number(account_id) || null;

            if (!accountId) {
                this.logger.error('AccountId was not passed', loggerContext);
                return new HttpException('AccountId was not passed', HttpStatus.BAD_REQUEST);
            }

            const appAccount = await this.accountRepository.getAccountById(accountId);

            if (!appAccount) {
                this.logger.error('Account not found', loggerContext);
                return new HttpException('Account not found', HttpStatus.NOT_FOUND);
            }

            appAccount.installed = false;

            const unInstalledAccount = await this.accountRepository.updateAccountByID(appAccount);

            this.logger.info('Account has been uninstalled!', loggerContext);

            return unInstalledAccount;
        } catch (error) {
            this.logger.error(error, loggerContext);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async paidStatus(userId: number): Promise<boolean | HttpException> {
        const loggerContext = `${AccountService.name}/${this.paidStatus.name}`;

        try {
            const user = await this.accountRepository.getAccountById(userId);

            if (!user) {
                this.logger.error('User not found in database', loggerContext);
                return new HttpException('User not found in database', HttpStatus.NOT_FOUND);
            }

            return user.isPaid || user.isTrial;
        } catch (error) {
            this.logger.error(error, loggerContext);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Cron(CronSettings.CronPaymentStatusCheckTime)
    protected async accountsPaymentStatusLoop(): Promise<void> {
        const loggerContext = `${AccountService.name}/${this.accountsPaymentStatusLoop.name}`;

        try {
            const accountDocuments = await this.accountRepository.getAllAccounts();

            for (const accountDocument of accountDocuments) {
                await this.accountPaymentChecker(accountDocument);
            }
        } catch (error) {
            this.logger.error(error, loggerContext);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private async accountPaymentChecker(accountDocument: AccountDocument): Promise<void> {
        const loggerContext = `${AccountService.name}/${this.accountPaymentChecker.name}`;

        try {
            if (!accountDocument.isActive) {
                this.logger.info(`Account is disabled!`, loggerContext, accountDocument.subdomain);
                return;
            }

            if (accountDocument.isPaid && dayjs(accountDocument.finishPaymentDate).diff(dayjs()) <= 0) {
                accountDocument.isPaid = false;
                accountDocument.isActive = false;
                await this.accountRepository.updateAccountByID(accountDocument);
                this.logger.info('Account was disabled by reason: End of payment period', loggerContext, accountDocument.subdomain);
                return;
            }

            if (dayjs(accountDocument.finishTrialDate).diff(dayjs()) <= 0) {
                accountDocument.isTrial = false;
                accountDocument.isActive = false;
                await this.accountRepository.updateAccountByID(accountDocument);
                this.logger.info('Account was disabled by reason: End of trial period', loggerContext, accountDocument.subdomain);
                return;
            }

            this.logger.info('Account is active!', loggerContext, accountDocument.subdomain);
        } catch (error) {
            this.logger.error(error, loggerContext);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
