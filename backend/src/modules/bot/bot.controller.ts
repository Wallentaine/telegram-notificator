import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Endpoints } from '../../core/consts/endpoints';
import { BotService } from './bot.service';
import { GetTelegramUsersDto } from './dto/get-telegram-users.dto';
import { TelegramUser } from '../account/account.model';
import { MarlboroLoggerService } from '../../core/marlboro-logger/marlboro-logger.service';
import { DigitalPipelineHookDto } from './dto/digital-pipeline-hook.dto';
import { UpdateTelegramUsersDto } from './dto/update-telegram-users.dto';
import { ValidateDtoPipe } from '../../core/pipes/validation.pipe';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Работа с ботом')
@Controller(Endpoints.Bot.Base)
export class BotController {
    constructor(
        private readonly botService: BotService,
        private readonly logger: MarlboroLoggerService
    ) {}

    @ApiOperation({ summary: 'Отправка сообщения пользователю' })
    @ApiResponse({ status: HttpStatus.OK })
    @UsePipes(ValidateDtoPipe)
    @Post(Endpoints.Bot.Notify)
    public async notify(@Body(new ValidationPipe({ transform: true })) dto: DigitalPipelineHookDto) {
        const loggerContext = `${BotController.name}/${this.notify.name}`;

        try {
            await this.botService.notify(dto);
        } catch (error) {
            this.logger.error(error, loggerContext);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation({ summary: 'Получение привязанных телеграм пользователей' })
    @Get(Endpoints.Bot.TelegramUsers)
    public async getTelegramUsers(@Query() dto: GetTelegramUsersDto): Promise<TelegramUser[]> {
        const loggerContext = `${BotController.name}/${this.getTelegramUsers.name}`;

        try {
            return await this.botService.getTelegramUsers(dto);
        } catch (error) {
            this.logger.error(error, loggerContext);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put(Endpoints.Bot.TelegramUsers)
    public async updateTelegramUsers(@Body('accountId') accountId: number, @Body('user') user: UpdateTelegramUsersDto) {
        const loggerContext = `${BotController.name}/${this.updateTelegramUsers.name}`;

        try {
            await this.botService.updateTelegramUser(accountId, user);
        } catch (error) {
            this.logger.error(error, loggerContext);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(Endpoints.Bot.TelegramUsers)
    public async deleteTelegramUser(@Body('accountId') accountId: number, @Body('user') user: UpdateTelegramUsersDto): Promise<void> {
        const loggerContext = `${BotController.name}/${this.deleteTelegramUser.name}`;

        try {
            await this.botService.deleteTelegramUser(accountId, user);
        } catch (error) {
            this.logger.error(error, loggerContext);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
