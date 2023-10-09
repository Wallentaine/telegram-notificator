import { Injectable, ConsoleLogger } from '@nestjs/common';
import { LoggerInterface } from './marlboro-logger.interface';
import * as log4js from 'log4js';
import dayjs from 'dayjs';
import chalk from 'chalk';

@Injectable()
export class MarlboroLoggerService extends ConsoleLogger implements LoggerInterface {
    private readonly maxLogFileSize = 2_048_000;

    private readonly consoleDateFormat: 'YYYY-MM-DD HH:mm:ss:SSS';

    private readonly outerLogger = log4js
        .configure({
            appenders: {
                everything: {
                    type: 'file',
                    filename: './logs/logs.log',
                    maxLogSize: this.maxLogFileSize,
                    layout: {
                        type: 'pattern',
                        pattern: '%d %p %f:%l %m%n',
                    },
                },
            },
            categories: {
                default: {
                    appenders: ['everything'],
                    level: 'debug',
                    enableCallStack: true,
                },
            },
        })
        .getLogger();

    public info(message: string, ...args: unknown[]): void {
        console.info(`${dayjs().format(this.consoleDateFormat)}`, chalk.bgGreen('INFO'), chalk.green(message), ...args);
        this.outerLogger.info(message, ...args);
    }

    public warn(message: string, ...args: unknown[]): void {
        console.warn(`${dayjs().format(this.consoleDateFormat)}`, chalk.bgYellow('WARN'), chalk.yellow(message), ...args);
        this.outerLogger.warn(message, ...args);
    }

    public error(message: string, ...args: unknown[]): void {
        console.error(`${dayjs().format(this.consoleDateFormat)}`, chalk.bgRed('ERROR'), chalk.red(message), ...args);
        this.outerLogger.error(message, ...args);
    }

    public debug(message: string, ...args: unknown[]): void {
        console.debug(`${dayjs().format(this.consoleDateFormat)}`, chalk.bgBlue('DEBUG'), chalk.blue(message), ...args);
        this.outerLogger.debug(message, ...args);
    }

    public log(message: string, ...args: unknown[]): void {
        console.log(`${dayjs().format(this.consoleDateFormat)}`, chalk.bgMagenta('LOG'), chalk.magenta(message), ...args);
    }
}
