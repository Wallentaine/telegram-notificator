import { Module } from '@nestjs/common';
import { AmoApiService } from './amo-api.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from '../account/account.model';
import { AccountRepository } from '../account/account.repository';
import { MarlboroLoggerService } from '../../core/marlboro-logger/marlboro-logger.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }])],
    providers: [AmoApiService, AccountRepository, MarlboroLoggerService],
    exports: [AmoApiService],
})
export class AmoApiModule {}
