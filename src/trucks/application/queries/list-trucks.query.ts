import { IQuery } from '@nestjs/cqrs';
import type { ListTrucksCriteria } from '../../domain/truck';

export class ListTrucksQuery implements IQuery {
  public constructor(public readonly criteria: ListTrucksCriteria) {}
}
