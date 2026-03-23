import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PingTrucksQuery, type PingTrucksResult } from './ping-trucks.query';

@QueryHandler(PingTrucksQuery)
export class PingTrucksHandler implements IQueryHandler<
  PingTrucksQuery,
  PingTrucksResult
> {
  public execute(): Promise<PingTrucksResult> {
    return Promise.resolve({ message: 'pong' });
  }
}
