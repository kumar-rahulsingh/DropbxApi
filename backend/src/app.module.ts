import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DropsignModule } from './dropsign/dropsign.module';
import { databaseConfig } from './config/database.config'; // Import the dynamic database config function

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration available throughout the app
      envFilePath: '.env', // Specify your .env file location
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule for access to environment variables
      useFactory: async (configService: ConfigService) =>
        databaseConfig(configService), // Use the async database config function
      inject: [ConfigService], // Inject ConfigService for use in the factory
    }),
    DropsignModule,
  ],
})
export class AppModule {}
