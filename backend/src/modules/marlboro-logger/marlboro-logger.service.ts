import { Injectable, ConsoleLogger } from '@nestjs/common';
import * as fs from 'fs-extra';

const MILLISECONDS_IN_SECOND = 60000;

@Injectable()
export class MarlboroLoggerService extends ConsoleLogger {
    private readonly logsDirectory = 'logs';

    private readonly logFileName = 'logs';

    private readonly logFileExtension = 'log';

    private readonly maxLogFileSize = 2_048_000;

    constructor() {
        super();
    }

    private getLogFilePath(subdomain?: string): string {
        const subdomainPath = subdomain ? `/${subdomain}` : '';
        return `${this.logsDirectory}${subdomainPath}/${this.logFileName}.${this.logFileExtension}`;
    }

    private clearLogFile(filePath: string) {
        try {
            fs.truncateSync(filePath);
        } catch (error) {
            super.error(error);
        }
    }

    private checkLogFileSize(filePath: string) {
        try {
            const stats = fs.statSync(filePath);

            if (stats.size >= this.maxLogFileSize) {
                this.clearLogFile(filePath);
            }
        } catch (error) {
            super.error(error);
        }
    }

    private logToFile(message: string, context?: string, subdomain?: string) {
        try {
            const logFilePath = this.getLogFilePath(subdomain);

            this.checkLogFileSize(logFilePath);

            const timezoneOffset = new Date().getTimezoneOffset() * MILLISECONDS_IN_SECOND;

            fs.ensureFileSync(logFilePath);
            fs.appendFileSync(
                logFilePath,
                `[${new Date(Date.now() - timezoneOffset).toISOString().slice(0, -1)}] [${context}] ${message}\n`
            );
        } catch (error) {
            super.error(error);
        }
    }

    public debug(message: unknown, context = '', subdomain?: string) {
        try {
            const textMessage = JSON.stringify(message);

            super.debug(message, context);

            this.logToFile(textMessage, context, subdomain);
        } catch (error) {
            super.error(error);
        }
    }

    public info(message: unknown, context = '', subdomain?: string) {
        try {
            const textMessage = JSON.stringify(message);

            super.log(message, context);

            this.logToFile(textMessage, context, subdomain);
        } catch (error) {
            super.error(error);
        }
    }

    public warn(message: unknown, context = '', subdomain?: string) {
        try {
            const textMessage = JSON.stringify(message);

            super.warn(message, context);

            this.logToFile(`WARNING: ${textMessage}`, context, subdomain);
        } catch (error) {
            super.error(error);
        }
    }

    public error(message: unknown, context = '', subdomain?: string, trace?: string) {
        try {
            const textMessage = JSON.stringify(message);

            super.error(message, trace, context);

            const errorMessage = trace ? `ERROR: ${textMessage}\nStack Trace:\n${trace}` : `ERROR: ${textMessage}`;
            this.logToFile(errorMessage, context, subdomain);
        } catch (error) {
            super.error(error);
        }
    }
}
