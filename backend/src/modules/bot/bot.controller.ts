import { Body, Controller, Get, HttpException, HttpStatus, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Endpoints } from '../../core/consts/endpoints';
import { BotService } from './bot.service';
import { GetTelegramUsersDto } from './dto/get-telegram-users.dto';
import { TelegramUser } from '../account/account.model';
import { MarlboroLoggerService } from '../../core/marlboro-logger/marlboro-logger.service';
import { DigitalPipelineHookDto } from './dto/digital-pipeline-hook.dto';
import { UpdateTelegramUsersDto } from './dto/update-telegram-users.dto';
import { ValidateDtoPipe } from '../../core/pipes/validation.pipe';

@Controller(Endpoints.Bot.Base)
export class BotController {
    constructor(
        private readonly botService: BotService,
        private readonly logger: MarlboroLoggerService
    ) {}

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
    public async updateTelegramUsers(@Body('accountId') accountId: number, @Body('users') users: UpdateTelegramUsersDto[]) {
        const loggerContext = `${BotController.name}/${this.updateTelegramUsers.name}`;

        try {
            await this.botService.updateTelegramUsers(accountId, users);
        } catch (error) {
            this.logger.error(error, loggerContext);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
