import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import type { Truck, TruckListResult } from '../domain/truck';
import { GetTruckByIdQuery } from '../application/queries/get-truck-by-id.query';
import { ListTrucksQuery } from '../application/queries/list-trucks.query';
import {
  PingTrucksQuery,
  type PingTrucksResult,
} from '../application/queries/ping-trucks.query';
import { ListTrucksQueryDto } from './dto/list-trucks-query.dto';
import { listTrucksQueryDtoToCriteria } from './list-trucks.mapper';
import {
  toListTrucksResponseDto,
  toTruckResponseDto,
  type ListTrucksResponseDto,
  type TruckResponseDto,
} from './dto/truck-response.dto';

@Controller('trucks')
export class TrucksController {
  public constructor(private readonly queryBus: QueryBus) {}

  // curl http://localhost:3000/trucks/ping
  @Get('ping')
  public ping(): Promise<PingTrucksResult> {
    return this.queryBus.execute<PingTrucksQuery, PingTrucksResult>(
      new PingTrucksQuery(),
    );
  }

  /**
   *   curl "http://localhost:3000/trucks/"
   *   curl "http://localhost:3000/trucks/?status=Loading&nameContains=Big"
   *   curl "http://localhost:3000/trucks/?sortField=name&sortOrder=desc&skip=10&limit=5"
   */
  @Get()
  public async listTrucks(
    @Query() query: ListTrucksQueryDto,
  ): Promise<ListTrucksResponseDto> {
    const criteria = listTrucksQueryDtoToCriteria(query);
    const result = await this.queryBus.execute<
      ListTrucksQuery,
      TruckListResult
    >(new ListTrucksQuery(criteria));
    return toListTrucksResponseDto(result);
  }

  // curl http://localhost:3000/trucks/<id>
  @Get(':id')
  public async getTruckById(
    @Param('id') id: string,
  ): Promise<TruckResponseDto> {
    const truck = await this.queryBus.execute<GetTruckByIdQuery, Truck>(
      new GetTruckByIdQuery(id),
    );
    return toTruckResponseDto(truck);
  }
}
