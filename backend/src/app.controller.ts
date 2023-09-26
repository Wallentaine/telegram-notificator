import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Endpoints } from './consts/endpoints';
import { HttpStatusCode } from 'axios';

@ApiTags('Работа с сервером')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @ApiOperation({ summary: 'Проверка работы приложения' })
    @ApiResponse({ status: HttpStatusCode.Ok })
    @Get(Endpoints.Runtime.Ping)
    public ping(): string {
        return this.appService.ping();
    }
}
