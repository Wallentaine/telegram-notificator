import { Controller, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import { AccountService } from './account.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountInstallDto } from './dto/account-install.dto';
import { AccountUninstallDto } from './dto/account-uninstall.dto';
import { AccountDocument } from './account.model';
import { Endpoints } from '../../core/consts/endpoints';

@ApiTags('Работа с пользователем виджета')
@Controller()
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @ApiOperation({ summary: 'Установка пользователем виджета' })
    @ApiResponse({ status: HttpStatus.OK })
    @Get(Endpoints.WidgetUser.Install)
    public async install(@Query() widgetUserInfo: AccountInstallDto): Promise<AccountDocument | HttpException> {
        return await this.accountService.install(widgetUserInfo);
    }

    @ApiOperation({ summary: 'Удаления пользователем виджета' })
    @ApiResponse({ status: HttpStatus.OK })
    @Get(Endpoints.WidgetUser.UnInstall)
    public async unInstall(@Query() widgetUserInfo: AccountUninstallDto): Promise<AccountDocument | HttpException> {
        return await this.accountService.unInstall(widgetUserInfo);
    }

    @ApiOperation({ summary: 'Получение статуса оплаты пользователя' })
    @ApiResponse({ status: HttpStatus.OK })
    @Get(Endpoints.WidgetUser.PaidStatus)
    public async paidStatus(@Query() userId: number): Promise<boolean | HttpException> {
        return await this.accountService.paidStatus(userId);
    }
}
