import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import {
    TokensResponse,
    AmoAccount,
    CreatedLead,
    CreatedLeadEmbedded,
    AmoLead,
    CreatedContact,
    CreatedContactEmbedded,
    AmoContact,
    CreatedNote,
} from './amo-api.types';
import { UseTokenAuthorization } from './useTokenAuthorization.decorator';
import * as process from 'process';
import { AuthQueryDto } from './dto/auth-query.dto';
import { AccountRepository } from '../account/account.repository';
import { AccountDocument } from '../account/account.model';
import { AmoEndPoints } from 'src/consts/amo-endpoints';
import { RequestTypes } from 'src/consts/request-types';
import { AuthTypes } from 'src/consts/auth-types';
import { MarlboroLoggerService } from '../marlboro-logger/marlboro-logger.service';

@Injectable()
export class AmoApiService {
    constructor(
        private readonly accountRepository: AccountRepository,
        private readonly logger: MarlboroLoggerService
    ) {}

    private async apiRequest<T = unknown>(
        subdomain: string,
        token: string,
        type: string,
        endpoint: string,
        body?: object
    ): Promise<AxiosResponse<T>> {
        switch (type) {
            case RequestTypes.Get: {
                return await axios[type]<T>(`https://${subdomain}.amocrm.ru/api/v4/${endpoint}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
            case RequestTypes.Patch:
            case RequestTypes.Post: {
                return await axios[type]<T>(`https://${subdomain}.amocrm.ru/api/v4/${endpoint}`, body, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
        }
    }

    private async getAccountInfo({ accountId, token }: AuthQueryDto): Promise<AccountDocument> {
        const loggerContext = `${AmoApiService.name}/${this.getAccountInfo.name}`;

        try {
            if (!accountId || !token) {
                this.logger.error(`accessToken or accountId not found`, loggerContext);
                new HttpException(`accessToken or accountId not found`, HttpStatus.BAD_REQUEST);
            }

            const accountInfo = await this.accountRepository.getAccountById(accountId);

            if (!accountInfo) {
                this.logger.error(`Account with id => ${accountId}, not found!`, loggerContext);
                new HttpException(`Account with id => ${accountId}, not found!`, HttpStatus.NOT_FOUND);
            }

            return accountInfo;
        } catch (error) {
            this.logger.error(error, loggerContext);
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async requestAccessToken(subdomain: string, code: string): Promise<TokensResponse> {
        const loggerContext = `${AmoApiService.name}/${this.requestAccessToken.name}`;

        try {
            const { data: tokens } = await axios.post<TokensResponse>(`https://${subdomain}.amocrm.ru/oauth2/access_token`, {
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                grant_type: AuthTypes.Auth,
                redirect_uri: process.env.REDIRECT_URI,
                code,
            });

            return tokens;
        } catch (error) {
            this.logger.error(error, loggerContext);
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async refreshAccessToken(subdomain: string, refreshToken: string): Promise<TokensResponse> {
        const loggerContext = `${AmoApiService.name}/${this.refreshAccessToken.name}`;

        try {
            const { data: tokens } = await axios.post<TokensResponse>(`https://${subdomain}.amocrm.ru/oauth2/access_token`, {
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                grant_type: AuthTypes.Refresh,
                refresh_token: refreshToken,
            });

            return tokens;
        } catch (error) {
            this.logger.error(error, loggerContext);
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async getAccountData(subdomain: string, token: string): Promise<AmoAccount> {
        const loggerContext = `${AmoApiService.name}/${this.getAccountData.name}`;

        try {
            const { data: accountData } = await this.apiRequest<AmoAccount>(subdomain, token, RequestTypes.Get, AmoEndPoints.Account.Base);

            return accountData;
        } catch (error) {
            this.logger.error(error, loggerContext);
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseTokenAuthorization()
    public async createLead({ accountId, token }: AuthQueryDto, leadInfo: AmoLead): Promise<CreatedLeadEmbedded | null> {
        const accountInfo = await this.getAccountInfo({ accountId, token });

        const response = await this.apiRequest<CreatedLead>(accountInfo.subdomain, token, RequestTypes.Post, AmoEndPoints.Leads.Base, [
            leadInfo,
        ]);

        const [createdLead] = response?.data?._embedded?.leads;

        return createdLead ?? null;
    }

    @UseTokenAuthorization()
    public async createContact({ accountId, token }: AuthQueryDto, contactInfo: AmoContact): Promise<CreatedContactEmbedded | null> {
        const accountInfo = await this.getAccountInfo({ accountId, token });

        const response = await this.apiRequest<CreatedContact>(
            accountInfo.subdomain,
            token,
            RequestTypes.Post,
            AmoEndPoints.Contacts.Base,
            [contactInfo]
        );

        const [createdContact] = response?.data?._embedded?.contacts;

        return createdContact ?? null;
    }

    @UseTokenAuthorization()
    public async createNoteByLeadId({ accountId, token }: AuthQueryDto, leadId: number, noteInfo: CreatedNote): Promise<void> {
        const accountInfo = await this.getAccountInfo({ accountId, token });

        await this.apiRequest(
            accountInfo.subdomain,
            token,
            RequestTypes.Post,
            `${AmoEndPoints.Leads.Base}/${leadId}/${AmoEndPoints.Notes.Base}`,
            [noteInfo]
        );
    }
}
