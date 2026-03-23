import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TrucksController } from './api/trucks.controller';
import { PingTrucksHandler } from './application/queries/ping-trucks.handler';

@Module({
  imports: [CqrsModule],
  controllers: [TrucksController],
  providers: [PingTrucksHandler],
})
export class TrucksModule {}
