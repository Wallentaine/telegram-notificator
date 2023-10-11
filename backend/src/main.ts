import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MarlboroLoggerService } from './core/marlboro-logger/marlboro-logger.service';
import * as process from 'process';
import { Endpoints } from './core/consts/endpoints';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new MarlboroLoggerService(),
    });

    const PORT = process.env.PORT || 3000;

    app.setGlobalPrefix(Endpoints.Global);

    app.enableCors();

    const config = new DocumentBuilder()
        .setTitle('Рефакторинг виджета "Уведомления в telegram от REON"')
        .setDescription('Документация')
        .setVersion('0.0.1')
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup(`/docs`, app, document);

    await app.listen(PORT, () => {
        app.get(MarlboroLoggerService).debug(`Ahhh shit...Here we go again: SERVER STARTED ON PORT ${PORT}`, 'SERVER');
    });
}

bootstrap().then();
