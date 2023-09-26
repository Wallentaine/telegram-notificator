import { ApiProperty } from '@nestjs/swagger';

export class AccountInstallDto {
    @ApiProperty({
        example: 'def502009b3d2ab2cc759db4c1a98061767e0',
        description: 'Код авторизации, приходит из AmoCRM',
    })
    readonly code: string;

    @ApiProperty({ example: 'example.amocrm.ru', description: 'Адрес аккаунта пользователя' })
    readonly referer: string;

    @ApiProperty({ example: '8db75afd-e11d-4315-9131-882c75ff8d15', description: 'ID интеграции' })
    readonly client_id: string;

    @ApiProperty({ example: '1' })
    readonly platform: string;

    @ApiProperty({ example: '1', description: 'Говорит о том, что запрос был вызван установкой виджета' })
    readonly from_widget: string;
}
