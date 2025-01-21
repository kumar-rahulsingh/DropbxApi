import { Test, TestingModule } from '@nestjs/testing';
import { DropsignService } from './dropsign.service';

describe('DropsignService', () => {
  let service: DropsignService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DropsignService],
    }).compile();

    service = module.get<DropsignService>(DropsignService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
