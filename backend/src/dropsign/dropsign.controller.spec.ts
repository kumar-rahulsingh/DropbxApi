import { Test, TestingModule } from '@nestjs/testing';
import { DropsignController } from './dropsign.controller';

describe('DropsignController', () => {
  let controller: DropsignController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DropsignController],
    }).compile();

    controller = module.get<DropsignController>(DropsignController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
