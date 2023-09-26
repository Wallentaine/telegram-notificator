import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class AuthQueryDto {
    @IsNotEmpty()
    @IsInt()
    @ApiProperty({
        example: '39012331',
        description: 'ID аккаунта amoCRM',
    })
    public readonly accountId: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example: 'def502009b3d2ab2cc759db4c1a98061767e0',
        description: 'Код авторизации(access_token)',
    })
    public token: string;
}
