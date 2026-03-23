import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import type { Truck, TruckListResult } from '../domain/truck';
import { CreateTruckCommand } from '../application/commands/create-truck.command';
import { DeleteTruckCommand } from '../application/commands/delete-truck.command';
import { UpdateTruckCommand } from '../application/commands/update-truck.command';
import { GetTruckByIdQuery } from '../application/queries/get-truck-by-id.query';
import { ListTrucksQuery } from '../application/queries/list-trucks.query';
import {
  PingTrucksQuery,
  type PingTrucksResult,
} from '../application/queries/ping-trucks.query';
import { CreateTruckDto } from './dto/create-truck.dto';
import { ListTrucksQueryDto } from './dto/list-trucks-query.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import {
  toListTrucksResponseDto,
  toTruckResponseDto,
  type ListTrucksResponseDto,
  type TruckResponseDto,
} from './dto/truck-response.dto';
import { listTrucksQueryDtoToCriteria } from './list-trucks.mapper';

@Controller('trucks')
export class TrucksController {
  public constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('ping')
  public ping(): Promise<PingTrucksResult> {
    return this.queryBus.execute<PingTrucksQuery, PingTrucksResult>(
      new PingTrucksQuery(),
    );
  }

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

  @Get(':id')
  public async getTruckById(
    @Param('id') id: string,
  ): Promise<TruckResponseDto> {
    const truck = await this.queryBus.execute<GetTruckByIdQuery, Truck>(
      new GetTruckByIdQuery(id),
    );
    return toTruckResponseDto(truck);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async createTruck(
    @Body() dto: CreateTruckDto,
  ): Promise<TruckResponseDto> {
    const truck = await this.commandBus.execute<CreateTruckCommand, Truck>(
      new CreateTruckCommand(dto.code, dto.name, dto.status, dto.description),
    );
    return toTruckResponseDto(truck);
  }

  @Patch(':id')
  public async updateTruck(
    @Param('id') id: string,
    @Body() dto: UpdateTruckDto,
  ): Promise<TruckResponseDto> {
    const truck = await this.commandBus.execute<UpdateTruckCommand, Truck>(
      new UpdateTruckCommand(
        id,
        dto.code,
        dto.name,
        dto.status,
        dto.description,
      ),
    );
    return toTruckResponseDto(truck);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteTruck(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute<DeleteTruckCommand, void>(
      new DeleteTruckCommand(id),
    );
  }
}
