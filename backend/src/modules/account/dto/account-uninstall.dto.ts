import { ApiProperty } from '@nestjs/swagger';

export class AccountUninstallDto {
    @ApiProperty({ example: 'asda12a', description: 'Уникальный UUID аккаунта' })
    readonly client_uuid: string;

    @ApiProperty({ example: '35870912', description: 'Уникальный ID аккаунта' })
    readonly account_id: string;
}
