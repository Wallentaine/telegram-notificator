import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from '../exceptions/validation.exception';
import { MarlboroLoggerService } from '../marlboro-logger/marlboro-logger.service';

@Injectable()
export class ValidateDtoPipe implements PipeTransform {
    constructor(private readonly logger: MarlboroLoggerService) {}

    public async transform(value: object, { metatype }: ArgumentMetadata): Promise<object> {
        const dtoInstance = plainToInstance(metatype, value);
        const errors = await validate(dtoInstance);

        if (errors.length > 0) {
            const messages = errors.map((err) => {
                return `${err.property} - ${Object.values(err.constraints).join(', ')}`;
            });

            throw new ValidationException(messages);
        }

        return value;
    }
}
