import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { TrucksController } from './api/trucks.controller';
import { TruckRepositoryPort } from './application/ports/truck.repository.port';
import { CreateTruckHandler } from './application/commands/create-truck.handler';
import { DeleteTruckHandler } from './application/commands/delete-truck.handler';
import { UpdateTruckHandler } from './application/commands/update-truck.handler';
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
    // query handlers
    PingTrucksHandler,
    GetTruckByIdHandler,
    ListTrucksHandler,
    // command handlers
    CreateTruckHandler,
    UpdateTruckHandler,
    DeleteTruckHandler,
    // infrastructure
    {
      provide: TruckRepositoryPort,
      useClass: TruckMongoRepository,
    },
  ],
})
export class TrucksModule {}
