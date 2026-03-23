import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TrucksModule } from './trucks/trucks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/app_db',
    ),
    TrucksModule,
  ],
})
export class AppModule {}
