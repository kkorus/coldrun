import { Module } from '@nestjs/common';
import { TrucksController } from './trucks.controller';

@Module({
  controllers: [TrucksController],
})
export class TrucksModule {}
