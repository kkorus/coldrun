import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  PingTrucksQuery,
  type PingTrucksResult,
} from '../application/queries/ping-trucks.query';
import console from 'console';

@Controller('trucks')
export class TrucksController {
  public constructor(private readonly queryBus: QueryBus) {}

  @Get()
  public getTrucks(): string {
    return 'Trucks';
  }

  // curl http://localhost:3000/trucks/ping
  @Get('ping')
  public ping(): Promise<PingTrucksResult> {
    return this.queryBus.execute(new PingTrucksQuery());
  }
}
