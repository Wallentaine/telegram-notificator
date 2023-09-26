import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AmoApiModule } from '../amo-api/amo-api.module';
import { AccountRepository } from './account.repository';
import { Account, AccountSchema } from './account.model';
import { MarlboroLoggerService } from '../marlboro-logger/marlboro-logger.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]), AmoApiModule],
    providers: [AccountService, AccountRepository, MarlboroLoggerService],
    controllers: [AccountController],
})
export class AccountModule {}
