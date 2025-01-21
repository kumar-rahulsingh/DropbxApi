import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DropsignController } from './dropsign.controller';
import { DropsignService } from './dropsign.service';
import { DropsignEntity } from './dropsign.entity'; // Import DropsignEntity

@Module({
  imports: [
    TypeOrmModule.forFeature([DropsignEntity]), // Register the repository here
  ],
  controllers: [DropsignController],
  providers: [DropsignService],
})
export class DropsignModule {}
