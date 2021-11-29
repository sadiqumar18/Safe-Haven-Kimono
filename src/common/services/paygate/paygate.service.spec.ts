import { Test, TestingModule } from '@nestjs/testing';
import { PaygateService } from './paygate.service';

describe('PaygateService', () => {
  let service: PaygateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaygateService],
    }).compile();

    service = module.get<PaygateService>(PaygateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
