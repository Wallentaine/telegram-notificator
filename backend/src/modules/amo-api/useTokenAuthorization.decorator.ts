import { AxiosError, AxiosResponse, HttpStatusCode } from 'axios';
import { AmoApiService } from './amo-api.service';
import * as mongoose from 'mongoose';
import { Account, AccountSchema } from '../account/account.model';
import * as process from 'process';
import { AccountRepository } from '../account/account.repository';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { AuthQueryDto } from './dto/auth-query.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { setTimeout as sleep } from 'node:timers/promises';
import { MarlboroLoggerService } from '../marlboro-logger/marlboro-logger.service';

dotenv.config({
    path: path.resolve(__dirname, '..', '..', '..', `.${process.env.NODE_ENV}.env`),
});

mongoose
    .connect(process.env.MONGO_CONNECT, {
        dbName: process.env.MONGO_NAME,
    })
    .then();

const accountModel = mongoose.model<Account>(Account.name, AccountSchema);

const ONE_SECOND_IN_MILLISECONDS = 1000;

export function UseTokenAuthorization(maxRetries = 5) {
    return function (target: object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
        const originalMethod = descriptor.value;

        const logger = new MarlboroLoggerService();
        const accountRepository = new AccountRepository(accountModel, logger);
        const amoApiService = new AmoApiService(accountRepository, logger);

        const loggerContext = `${UseTokenAuthorization.name}/${originalMethod.name}`;

        descriptor.value = async function (authDto: AuthQueryDto, ...args: unknown[]): Promise<AxiosResponse | AxiosError> {
            let retries = 1;

            while (true) {
                try {
                    return await originalMethod.apply(this, [authDto, ...args]);
                } catch (error) {
                    const accountInfo = await accountRepository.getAccountById(authDto.accountId);

                    const errorStatus = (error as AxiosError).response?.status;

                    switch (errorStatus) {
                        case HttpStatusCode.Unauthorized: {
                            if (retries <= maxRetries) {
                                logger.warn(
                                    `${error.message} \n Try to update the tokens and send the request again \n Attempt: ${retries}`,
                                    loggerContext,
                                    accountInfo.subdomain
                                );

                                const tokensData = await amoApiService.refreshAccessToken(accountInfo.subdomain, accountInfo.refreshToken);

                                accountInfo.accessToken = tokensData.access_token;
                                accountInfo.refreshToken = tokensData.refresh_token;

                                await accountRepository.updateAccountByID(accountInfo);

                                authDto.token = tokensData.access_token;

                                retries++;
                            } else {
                                logger.error(
                                    'Reached maximum retry count. Could not refresh tokens.',
                                    loggerContext,
                                    accountInfo.subdomain
                                );

                                throw new HttpException(error.response.data, HttpStatus.UNAUTHORIZED);
                            }
                            break;
                        }
                        case HttpStatusCode.BadRequest:
                        case HttpStatusCode.NotFound: {
                            if (retries <= maxRetries) {
                                logger.warn(
                                    `${error.message} \n Try to send the request again \n Attempt: ${retries}`,
                                    loggerContext,
                                    accountInfo.subdomain
                                );
                                retries++;
                            } else {
                                logger.error(
                                    'Reached maximum retry count. Could not refresh tokens.',
                                    loggerContext,
                                    accountInfo.subdomain
                                );

                                throw new HttpException(
                                    error.response.data,
                                    errorStatus === HttpStatusCode.NotFound ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST
                                );
                            }
                            break;
                        }
                        case HttpStatusCode.TooManyRequests: {
                            if (retries <= maxRetries) {
                                logger.warn(
                                    `${error.message} \n Try to send the request again \n Attempt: ${retries}`,
                                    loggerContext,
                                    accountInfo.subdomain
                                );
                                await sleep(ONE_SECOND_IN_MILLISECONDS);
                                retries++;
                            } else {
                                logger.error(
                                    'Reached maximum retry count. Could not refresh tokens.',
                                    loggerContext,
                                    accountInfo.subdomain
                                );

                                throw new HttpException(error.response.data, HttpStatus.TOO_MANY_REQUESTS);
                            }
                            break;
                        }
                        default: {
                            if (retries <= maxRetries) {
                                logger.warn(
                                    `${error.message} \n Try to send the request again \n Attempt: ${retries}`,
                                    loggerContext,
                                    accountInfo.subdomain
                                );
                                retries++;
                            } else {
                                logger.error(error.message, loggerContext, accountInfo.subdomain);

                                throw new HttpException(error.response.data, HttpStatus.INTERNAL_SERVER_ERROR);
                            }
                        }
                    }
                }
            }
        };

        return descriptor;
    };
}
