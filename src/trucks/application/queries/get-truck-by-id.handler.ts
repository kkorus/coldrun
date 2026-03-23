import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import type { Truck } from '../../domain/truck';
import { TruckRepositoryPort } from '../ports/truck.repository.port';
import { GetTruckByIdQuery } from './get-truck-by-id.query';

@QueryHandler(GetTruckByIdQuery)
export class GetTruckByIdHandler implements IQueryHandler<
  GetTruckByIdQuery,
  Truck
> {
  public constructor(private readonly truckRepository: TruckRepositoryPort) {}

  public async execute(query: GetTruckByIdQuery): Promise<Truck> {
    const truck = await this.truckRepository.findById(query.id);
    if (!truck) {
      throw new NotFoundException(`Truck with id ${query.id} not found`);
    }
    return truck;
  }
}
