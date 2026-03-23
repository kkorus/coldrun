import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { TrucksController } from './api/trucks.controller';
import { TruckRepositoryPort } from './application/ports/truck.repository.port';
import { GetTruckByIdHandler } from './application/queries/get-truck-by-id.handler';
import { ListTrucksHandler } from './application/queries/list-trucks.handler';
import { PingTrucksHandler } from './application/queries/ping-trucks.handler';
import { TruckMongoRepository } from './infrastructure/persistence/truck.repository';
import {
  TruckModel,
  TruckSchema,
} from './infrastructure/persistence/truck.schema';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([{ name: TruckModel.name, schema: TruckSchema }]),
  ],
  controllers: [TrucksController],
  providers: [
    PingTrucksHandler,
    GetTruckByIdHandler,
    ListTrucksHandler,
    {
      provide: TruckRepositoryPort,
      useClass: TruckMongoRepository,
    },
  ],
})
export class TrucksModule {}
