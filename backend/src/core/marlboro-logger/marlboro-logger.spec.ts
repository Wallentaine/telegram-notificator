import { Test, TestingModule } from '@nestjs/testing';
import { MarlboroLoggerService } from './marlboro-logger.service';

describe('MarlboroLoggerService', () => {
    let service: MarlboroLoggerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MarlboroLoggerService],
        }).compile();

        service = module.get<MarlboroLoggerService>(MarlboroLoggerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
