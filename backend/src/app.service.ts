import { Injectable } from '@nestjs/common';
import { MarlboroLoggerService } from './modules/marlboro-logger/marlboro-logger.service';

@Injectable()
export class AppService {
    constructor(private readonly logger: MarlboroLoggerService) {}

    public ping(): string {
        const loggerContext = `${AppService.name}/${this.ping.name}`;

        try {
            this.logger.info('SERVER WORKED', loggerContext);
            return `SERVER WORKING RIGHT NOW ${Date.now()}`;
        } catch (error) {
            this.logger.error(error, loggerContext);
        }
    }
}
