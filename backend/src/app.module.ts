import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DropsignModule } from './dropsign/dropsign.module';
import { databaseConfig } from './config/database.config'; 
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env', 
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], 
      useFactory: async (configService: ConfigService) =>
        databaseConfig(configService), 
      inject: [ConfigService], 
    }),
    DropsignModule,
  ],
})
export class AppModule {}
