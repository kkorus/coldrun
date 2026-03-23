import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import type { TruckListResult } from '../../domain/truck';
import { TruckRepositoryPort } from '../ports/truck.repository.port';
import { ListTrucksQuery } from './list-trucks.query';

@QueryHandler(ListTrucksQuery)
export class ListTrucksHandler implements IQueryHandler<
  ListTrucksQuery,
  TruckListResult
> {
  public constructor(private readonly truckRepository: TruckRepositoryPort) {}

  public async execute(query: ListTrucksQuery): Promise<TruckListResult> {
    return this.truckRepository.findMany(query.criteria);
  }
}
