import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DropsignController } from './dropsign.controller';
import { DropsignService } from './dropsign.service';
import { DropsignEntity } from './dropsign.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([DropsignEntity]), 
  ],
  controllers: [DropsignController],
  providers: [DropsignService],
})
export class DropsignModule {}